# JavaScript

Monorepo for all the JavaScript within Yoast

## Useful commands

* `yarn lint`, will run linting for all packages.
* `yarn test`, will run tests for all packages.
* `yarn link-all`, will run `yarn link` for all packages.
* `yarn unlink-all`, will run `yarn unlink` for all paackages.

## General file structure of a package

* `/src`. Source files
* `/tests`. Unit tests.
* `/tools`. Tooling necessary to build or test.
* `/package.json`

## What lives where?

https://github.com/Yoast/YoastSEO.js moved to `packages/yoastseo`.
https://github.com/Yoast/yoast-components moved to `packages/yoast-components`.

## Moving pull requests & branches

These need to be moved manually. For your convenience the `yarn transfer-branch` command exists. It has 3 arguments:

* Package: Which package to transfer to/from, has the following options:

    * yoastseo
    * yoast-components

* Base branch: Which branch the branch you want to move is based on. It is the base branch in a pull request.

* Branch to move: The branch you want to move.

These arguments are positional. Think `yarn transfer-branch [package] [base-branch] [branch-to-move]`

After moving the branch connected to a pull request you need to manually recreate the pull request here. That should be a matter of copy & pasting and linking to the original PR for archive purposes.
