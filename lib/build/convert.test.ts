import { Readable } from "node:stream";

import { convert } from "./convert";
import { type SourceEmoji } from "../interfaces";
import { type Emoji } from "../../index";

describe("convert", () => {
  let emojis: Emoji[] = [];

  function newSourceEmoji(value: SourceEmoji["value"]): SourceEmoji {
    return { value };
  }

  beforeEach(() => {
    emojis = [];
  });

  it("generates converted emojis", async () => {
    function* generate() {
      // simple
      yield newSourceEmoji({
        name: "PUT LITTER IN ITS PLACE SYMBOL",
        unified: "1F6AE",
        short_name: "put_litter_in_its_place",
        short_names: ["put_litter_in_its_place"],
      });

      // simple
      yield newSourceEmoji({
        name: "THINKING FACE",
        unified: "1F914",
        short_name: "thinking_face",
        short_names: ["thinking_face"],
      });

      // with aliases
      yield newSourceEmoji({
        name: "LADY BEETLE",
        unified: "1F41E",
        short_name: "ladybug",
        short_names: ["ladybug", "lady_beetle"],
      });

      // with skinVariations
      yield newSourceEmoji({
        name: "PERSON IN SUIT LEVITATING",
        unified: "1F574-FE0F",
        short_name: "man_in_business_suit_levitating",
        short_names: ["man_in_business_suit_levitating"],
        skin_variations: {
          "1F3FB": {
            unified: "1F574-1F3FB",
          },
          "1F3FC": {
            unified: "1F574-1F3FC",
          },
          "1F3FD": {
            unified: "1F574-1F3FD",
          },
          "1F3FE": {
            unified: "1F574-1F3FE",
          },
          "1F3FF": {
            unified: "1F574-1F3FF",
          },
        },
      });
    }
    const src = Readable.from(generate());
    for await (const emoji of src.pipe(convert())) {
      emojis.push(emoji);
    }

    expect(emojis).toHaveLength(4);

    let emoji = emojis[0];
    expect(emoji.name).toBe("put_litter_in_its_place");
    expect(emoji.unicode).toBe("1F6AE");
    expect(emoji).not.toHaveProperty("skinVariations");
    expect(emoji).not.toHaveProperty("aliases");

    emoji = emojis[1];
    expect(emoji.name).toBe("thinking_face");
    expect(emoji.unicode).toBe("1F914");
    expect(emoji).not.toHaveProperty("skinVariations");
    expect(emoji).not.toHaveProperty("aliases");

    emoji = emojis[2];
    expect(emoji.name).toBe("ladybug");
    expect(emoji.unicode).toBe("1F41E");
    expect(emoji).not.toHaveProperty("skinVariations");
    expect(emoji.aliases).toHaveLength(1);
    expect(emoji.aliases).toContain("lady_beetle");

    emoji = emojis[3];
    expect(emoji.name).toBe("man_in_business_suit_levitating");
    expect(emoji.unicode).toBe("1F574-FE0F");
    expect(emoji).toHaveProperty("skinVariations");
    const skins = emoji.skinVariations!;
    expect(skins["2"].name).toBe(
      "man_in_business_suit_levitating::skin-tone-2",
    );
    expect(skins["2"].unicode).toBe("1F574-1F3FB");
    expect(skins["3"].name).toBe(
      "man_in_business_suit_levitating::skin-tone-3",
    );
    expect(skins["3"].unicode).toBe("1F574-1F3FC");
    expect(skins["4"].name).toBe(
      "man_in_business_suit_levitating::skin-tone-4",
    );
    expect(skins["4"].unicode).toBe("1F574-1F3FD");
    expect(skins["5"].name).toBe(
      "man_in_business_suit_levitating::skin-tone-5",
    );
    expect(skins["5"].unicode).toBe("1F574-1F3FE");
    expect(skins["6"].name).toBe(
      "man_in_business_suit_levitating::skin-tone-6",
    );
    expect(skins["6"].unicode).toBe("1F574-1F3FF");
    expect(emoji).not.toHaveProperty("aliases");
  });
});
