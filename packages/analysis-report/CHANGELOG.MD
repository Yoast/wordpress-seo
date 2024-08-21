# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.
We follow [Semantic Versioning](http://semver.org/).

## Future Release
### Enhancements:
* Removes an unused named export `AnalysisResult`. Potentially breaking, if you were importing this directly. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Makes it possible to render the AI Assessment Fixes button inside `AnalysisResult.js`. [#21348](https://github.com/Yoast/wordpress-seo/pull/21348)
* Strips HTML tags from the AnalysisResult _text_. Allowed tags are: _a_, _b_, _strong_, _em_ and _i_. [#20086](https://github.com/Yoast/wordpress-seo/pull/20086)
* Strips HTML tags from the ScoreAssessment _html_. Allowed tags are: _a_, _b_, _strong_, _em_, _i_, _span_, _p_, _ul_, _ol_, _li_ and _div_. [#20086](https://github.com/Yoast/wordpress-seo/pull/20086)

### Non user facing:
* Now published as a transpiled package.
* Adds a development dependency `eslint-plugin-import`. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Improves internal imports. [#20003](https://github.com/Yoast/wordpress-seo/pull/20003)
* Implements Babel, ESLint and Jest preset packages. [#18398](https://github.com/Yoast/wordpress-seo/pull/18398)
* Upgrades `styled-components` to `5.3.6` to fix compatibility with React 18. [#19857](https://github.com/Yoast/wordpress-seo/pull/19857)
* Upgrades react to 18.2.0, Upgrade react test renderer. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Upgrades ESLint and plugins (`import`, `jsx-a11y` and `react`) to the latest versions. [#21315](https://github.com/Yoast/wordpress-seo/pull/21315)

## 1.2.0 April 23rd, 2020
### Other
* Adds a CSS test stub.

## 0.12.0 January 6th, 2020
### Other
* Drops IE11 support through configuring Babel to use the preset environment with the own list of supported browsers specified.

## 0.4.0 June 11th, 2019
### Changed
* Added a margin of 16px to the left of the marker button, so the link and button are not too close.

## 0.1.0 April 29th, 2019
### Added
* Splits out `@yoast/analysis-report` from `@yoast/yoast-components`. This package contains components that are used to render analysis results.
