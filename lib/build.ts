import { createReadStream, createWriteStream } from "node:fs";
import { join } from "node:path";
import { Transform, Writable, type TransformCallback } from "node:stream";
import { pipeline } from "node:stream/promises";

import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";

import { type SKIN_CODE, type SourceEmoji } from "./interfaces";

import { type Emoji } from "../index";

const DEBUG = !!process.env.DEBUG;

const SKIN_VARIATIONS: Record<SKIN_CODE, string> = {
  "1F3FB": "2",
  "1F3FC": "3",
  "1F3FD": "4",
  "1F3FE": "5",
  "1F3FF": "6",
};

function convert() {
  return new Transform({
    objectMode: true,
    transform(
      chunk: SourceEmoji,
      _encoding: BufferEncoding,
      callback: TransformCallback
    ) {
      const { value } = chunk;
      const { short_name: name, short_names, unified: unicode } = value;

      const emoji: Emoji = {
        name,
        unicode,
      };

      if (short_names.length > 1) {
        emoji.aliases = short_names.filter((n) => n !== name);
      }

      if ("skin_variations" in value && !!value.skin_variations) {
        emoji.skinVariations = {};
        const skinVariations = value.skin_variations;
        for (const skinCode in skinVariations) {
          const skin = skinVariations[skinCode as SKIN_CODE];
          if (!skin) continue;

          const code: string | undefined =
            SKIN_VARIATIONS[skinCode as SKIN_CODE];
          if (!code) {
            if (DEBUG) {
              console.error(`Unknown skin code is found: ${skinCode}`);
            }
            continue;
          }

          emoji.skinVariations[code] = {
            name: `${name}::skin-tone-${code}`,
            unicode: skin.unified,
          };
        }
      }

      this.push(emoji);
      callback();
    },
  });
}

// Cannot detect the last chunk in Node.js stream.
async function getLastName(path: string) {
  let lastName = "";

  await pipeline(
    createReadStream(path),
    parser(),
    streamArray(),
    new Writable({
      objectMode: true,
      write(
        chunk: SourceEmoji,
        _encoding: BufferEncoding,
        callback: (error?: Error) => void
      ) {
        lastName = chunk.value.short_name;
        callback();
      },
    })
  );

  return lastName;
}

function toJSONString(lastName: string): Transform {
  let first = true;

  return new Transform({
    writableObjectMode: true,
    transform(
      chunk: Emoji,
      _encoding: BufferEncoding,
      callback: TransformCallback
    ) {
      if (first) {
        this.push("[");
        first = false;
      }

      this.push(JSON.stringify(chunk));

      if (chunk.name !== lastName) {
        this.push(",");
      } else {
        this.push("]");
      }

      callback();
    },
  });
}

async function main() {
  const srcPath = join(
    __dirname,
    "../node_modules/emoji-datasource/emoji.json"
  );
  const destPath = join(__dirname, "../index.json");

  const lastName = await getLastName(srcPath);

  await pipeline(
    createReadStream(srcPath),
    parser(),
    streamArray(),
    convert(),
    toJSONString(lastName),
    createWriteStream(destPath)
  );
}

main()
  .catch(console.error)
  .finally(() => {
    console.log(`Build index.json`);
  });
