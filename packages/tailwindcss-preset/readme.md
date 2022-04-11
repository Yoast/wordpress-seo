# `@yoast/tailwindcss-preset`

This package aims to provide a Tailwind CSS preset for building Yoast packages.

## Installation & setup
Start with installing the package and its peer dependencies from NPM:

```shell
yarn add --dev @yoast/tailwindcss-preset tailwindcss @tailwindcss/forms
```

Then, in your `tailwind.config.js` file, extend the preset like so:

```js
module.exports = {
    presets: [ require( "@yoast/tailwindcss-preset" ) ],
    // Your custom configuration.
};
```