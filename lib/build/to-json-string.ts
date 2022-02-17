import { Transform, type TransformCallback } from "node:stream";

import { type Emoji } from "../../index";

export function toJSONString(lastName: string): Transform {
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
