# JavaScript

## Packages

Isolated JavaScript packages used within Yoast.

This monorepo includes reusable packages:

- [@yoast/analysis-report](analysis-report)
  - React components that can be used to visualise the outcome of the Yoast content analysis provided by [the yoastseo package](packages/yoastseo).
- [@yoast/components](components)
  - All-purpose React components.
- [@yoast/configuration-wizard](configuration-wizard)
  - A wizard that guides users trough their initial Yoast SEO plugin setup.
- [@yoast/feature-flag](feature-flag)
  - A utility that keeps track of enabled and disabled features.
- [@yoast/helpers](helpers)
  - A set of helper functions that can be used across multiple projects.
- [@yoast/replacement-variable-editor](replacement-variable-editor)
  - The replacement variable editor currently used in the Search Metadata previews. In the future, this component will also be used in the Social Metadata previews.
- [@yoast/schema-blocks](schema-blocks)
  - classes and React components used in generating schema blocks from wordpress posts.
- [@yoast/search-metadata-previews](search-metadata-previews)
  - React components that can be used to generate a preview of what a page will look like in Google's search results.
- [@yoast/social-metadata-forms](social-metadata-forms)
  - React components that can be used to render forms for controlling the social preview settings. This includes the redux store.
- [@yoast/social-metadata-previews](social-metadata-previews)
  - React components that can be used to generate a preview of what a page will look like when shared trough Facebook or Twitter.
- [@yoast/style-guide](style-guide)
  - A combination of style constants and functions that can be used to conform to the Yoast corporate identity.
- [eslint-config-yoast](eslint)
  - ESLint configuration for Yoast projects.
- [yoast-components](yoast-components) *[deprecated. replaced by [@yoast/components](packages/components)]*
  - All-purpose React components.
- [yoastseo](yoastseo) *[Replaces [YoastSEO.js](https://github.com/yoast//yoastseo.js)]*
  - Text analysis and assessment library in JavaScript. This library can generate interesting metrics about a text and assess these metrics to give you an assessment which can be used to improve the text.

All new package should be [scoped](https://docs.npmjs.com/misc/scope) with `@yoast/` , so they can be published as part of the [Yoast organisation](https://www.npmjs.com/org/yoast). When creating a new package with translations, please mind that they need to be added to the pipeline ([for context see this issue](https://github.com/Yoast/wordpress-seo/issues/13360)).

## General file structure of a package

- `/src`. Source files
- `/tests`. Unit tests.
- `/tools`. Tooling necessary to build or test.
- `/package.json`

## Useful commands

The following commands can be executed from the javascript project root:

* `yarn install`, will install all dependencies for all packages.
* `yarn lint`, will run linting for all packages.
* `yarn test`, will run tests for all packages.
