# JavaScript

## Packages

Monorepo for all the JavaScript within Yoast.

### javascript/packages

This monorepo includes reusable packages:

- [@yoast/analysis-report](packages/analysis-report)
  - React components that can be used to visualise the outcome of the Yoast content analysis provided by [the yoastseo package](packages/yoastseo).
- [@yoast/components](packages/components)
  - All-purpose React components.
- [@yoast/configuration-wizard](packages/configuration-wizard)
  - A wizard that guides users trough their initial Yoast SEO plugin setup.
- [@yoast/feature-toggle](packages/feature-toggle)
  - A utility that keeps track of enabled and disabled features.
- [@yoast/helpers](packages/helpers)
  - A set of helper functions that can be used across multiple projects.
- [@yoast/search-metadata-previews](packages/search-metadata-previews)
  - React components that can be used to generate a preview of what a page will look like in Google's search results.
- [@yoast/replacement-variable-editor](packages/replacement-variable-editor)
  - The replacement variable editor currently used in the Search Metadata previews. In the future, this component will also be used in the Social Metadata previews.
- [@yoast/social-metadata-previews](packages/social-metadata-previews) *[Will replace [yoast-social-previews](packages/yoast-social-previews)]*
  - React components that can be used to generate a preview of what a page will look like when shared trough Facebook or Twitter.
- [@yoast/social-metadata-forms](packages/social-metadata-forms)
  - React components that can be used to render forms for controlling the social preview settings. This includes the redux store.
- [@yoast/style-guide](packages/style-guide)
  - A combination of style constants and functions that can be used to conform to the Yoast corporate identity.
- [eslint-config-yoast](packages/eslint)
  - ESLint configuration for Yoast projects.
- [yoast-components](packages/yoast-components) *[deprecated. replaced by [@yoast/components](packages/components)]*
  - All-purpose React components.
- [yoast-social-previews](packages/yoast-social-previews) *[Will be replaced by @yoast/social-metadata-previews]*
  - Classes that can be used to generate a preview of what a page will look like when shared trough Facebook or Twitter.
- [yoastseo](packages/yoastseo) *[Replaces [YoastSEO.js](https://github.com/yoast//yoastseo.js)]*
  - Text analysis and assessment library in JavaScript. This library can generate interesting metrics about a text and assess these metrics to give you an assessment which can be used to improve the text.

All new package should be [scoped](https://docs.npmjs.com/misc/scope) with `@yoast/` , so they can be published as part of the [Yoast organisation](https://www.npmjs.com/org/yoast). When creating a new package with translations, please mind that they need to be added to the pipeline ([for context see this issue](https://github.com/Yoast/wordpress-seo/issues/13360)).

### javascript/apps

This monorepo includes apps for testing purposes. These apps are not published. Apps include:

- [Components](apps/components)
  - A test application for most `@yoast` packages.
- [Content-analysis](apps/content-analysis)
  - A test application for the content analysis.

## General file structure of a package

- `/src`. Source files
- `/tests`. Unit tests.
- `/tools`. Tooling necessary to build or test.
- `/package.json`

## Useful commands

The following commands can be executed from the javascript project root:

* `yarn install`, will install all dependencies for all packages.
* `yarn lint`, will run linting for all pacwhichkages.
* `yarn test`, will run tests for all packages.
* `yarn link-all`, will run `yarn link` for all packages.
* `yarn unlink-all`, will run `yarn unlink` for all packages.

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

These arguments are positional. Think `yarn transfer-branch [package] [base-branch] [branch-to-move]`.

After moving the branch connected to a pull request you need to manually recreate the pull request here. That should be a matter of copy & pasting and linking to the original PR for archive purposes.
