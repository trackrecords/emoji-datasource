import { Transform, type TransformCallback } from "node:stream";

import { type SKIN_CODE, type SourceEmoji } from "../interfaces";
import { type Emoji } from "../../index";

const DEBUG = !!process.env.DEBUG;

const SKIN_VARIATIONS: Record<SKIN_CODE, string> = {
  "1F3FB": "2",
  "1F3FC": "3",
  "1F3FD": "4",
  "1F3FE": "5",
  "1F3FF": "6",
};

export function convert() {
  return new Transform({
    objectMode: true,
    transform(
      chunk: SourceEmoji,
      _encoding: BufferEncoding,
      callback: TransformCallback,
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
