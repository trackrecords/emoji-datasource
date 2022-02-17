import { createReadStream } from "node:fs";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";

import { type SourceEmoji } from "../interfaces";

// Cannot detect the last chunk in Node.js stream.
export async function getLastName(path: string) {
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
