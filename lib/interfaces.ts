// Put internal interfaces and types.

export type SKIN_CODE = "1F3FB" | "1F3FC" | "1F3FD" | "1F3FE" | "1F3FF";

export interface SourceEmoji {
  value: {
    name: string;
    unified: string;
    short_name: string;
    short_names: string[];
    skin_variations?: Record<SKIN_CODE, { unified: string }>;
  };
}
