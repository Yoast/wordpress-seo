# `@yoast/postcss-preset`

This package aims to provide a PostCSS preset for building Yoast packages.

## Usage

```js
// postcss.config.js
const preset = require( "@yoast/postcss-preset" );
module.exports = {
    ...preset,
    plugins: [
        ...preset.plugins,
        // Your custom plugins.
    ],
};
```