# Schema blocks package

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
