# `@yoast/jest-preset`

This package aims to provide a Jest preset for testing Yoast packages.

## Usage

```js
// jest.config.js
module.exports = {
    preset: "@yoast/jest-preset",
    // Your custom configuration.
};
```

### React 18 and React 19 with react-test-renderer

Packages that use `react-test-renderer` can opt in to a shared setup that enables the `act()` environment and keeps snapshots identical under React 18 and React 19:

```js
// A file listed in `setupFilesAfterEnv`.
import "@yoast/jest-preset/react-test-renderer";
```
