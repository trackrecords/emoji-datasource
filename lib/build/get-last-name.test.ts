import { join } from "node:path";

import { getLastName } from "./get-last-name";

describe("getLastName", () => {
  it("returns a name of the last chunk", async () => {
    const path = join(
      __dirname,
      "../../node_modules/emoji-datasource/emoji.json"
    );
    const name = await getLastName(path);

    expect(name).toBe("secret");
  });
});
