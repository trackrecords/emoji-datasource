import { Readable } from "node:stream";

import { toJSONString } from "./to-json-string";
import { type Emoji } from "../../index";

describe("toJSONString", () => {
  it("generates a string of an array of JSON objects", async () => {
    const lastName = "thinking_face";

    const emoji1: Emoji = {
      unicode: "1F6AE",
      name: "put_litter_in_its_place",
    };

    const emoji2: Emoji = {
      unicode: "1F914",
      name: lastName,
    };

    function* generate() {
      yield emoji1;
      yield emoji2;
    }

    const src = Readable.from(generate()).pipe(toJSONString(lastName));
    let str = "";
    for await (const s of src) {
      str += s;
    }

    expect(str).toBe(`[${JSON.stringify(emoji1)},${JSON.stringify(emoji2)}]`);
  });
});
