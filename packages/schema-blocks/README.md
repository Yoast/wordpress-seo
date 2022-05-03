# Schema blocks package

A package used for our schema blocks API.

## Usage

This package is intended to be used in a WordPress plugin.

Install the package (`yarn add @yoast/schema-blocks`) in your plugin.

Use the package like this:

```
import initialize from "@yoast/schema-blocks";

initialize();
```

## Development

This package is written in `typescript` (in the `src` folder) and the transpiled javacript resides in the `dist` folder. After installing this package's dependencies you can run `yarn build` to create the dist folder. During development you can use `yarn watch` to transpile the typescript after every change in the `src` folder.

## Testing

### Running the tests
You can run the tests by calling `yarn test` in the root folder of this package.

Running `yarn test --coverage` runs the tests with code coverage enabled.

### Adding tests.
The tests are located in the `tests/` folder. This folder should follow the same directory structure as the `src/` folder.

The tests should follow this naming convention:
```
{name_of_file_under_test}.test.ts
```

For example, the test for `src/functions/xyz.ts` should be located in `test/functions/xyz.test.ts`.
