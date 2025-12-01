# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.
We follow [Semantic Versioning](http://semver.org/).

## 0.1.1
Other:
* Upgrades WP packages to minimum supported WP version 6.7. [#22466](https://github.com/Yoast/wordpress-seo/pull/22466)

Non user facing:
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)

## 0.1.0
Enhancements:
* Adds override `fetchJson` option to the Remote Data Provider. [#22178](https://github.com/Yoast/wordpress-seo/pull/22178)
* Sets up Storybook with stories for the Organic Sessions widget. [#22178](https://github.com/Yoast/wordpress-seo/pull/22178)
* Exposes internal `fetchJson` and `useFetch` tools for creating your own widgets. [#22178](https://github.com/Yoast/wordpress-seo/pull/22178)
* Adds widgets and services as building blocks to create a dashboard page. [#22152](https://github.com/Yoast/wordpress-seo/pull/22152)

Bugfixes:
* Fixes a bug where the screen reader only table in the Organic Sessions widget was influencing the width on the page. [#22234](https://github.com/Yoast/wordpress-seo/pull/22234)
