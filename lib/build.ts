import { createReadStream, createWriteStream } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";

import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";

import { getLastName } from "./build/get-last-name";
import { convert } from "./build/convert";
import { toJSONString } from "./build/to-json-string";

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
