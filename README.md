# `@trackrecords/emoji-datasource`

This is a lighter and a little bit processed version of [emoji-datasource](https://github.com/iamcal/emoji-data) for TRACKRECORDS internal use.

## Usage

```ts
// Make sure `compilerOptions.resolveJsonModule` is true in your tsconfig.json.
import emojis from "@trackrecords/emoji-datasource/index.json";
import { type Emoji } from "@trackrecords/emoji-datasource";
```

## Version Management

This package corresponds with `emoji-datasource` and major and minor version is the same with the package.

e.g.,

```
emoji-datasource 7.0.2  -> @trackrecords/emoji-datasource 7.0.x
```
