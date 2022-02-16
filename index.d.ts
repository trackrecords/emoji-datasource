export interface Emoji {
  name: string;
  unicode: string;
  skinVariations?: {
    // "2" ~ "6"
    [skinId: string]: {
      name: string;
      unicode: string;
    };
  };
  aliases?: Array<string>;
}
