# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.
We follow [Semantic Versioning](http://semver.org/).

## 5.0.1 - 2018-09-28

### Changed

* Changes `no-console` to a warning. This makes it more useful when using webpack dev server.

## 5.0 - 2018-09-24

#### Breaking changes

* Use the JSX a11y recommended rules, only exception is `label-has-for`.

#### Changed

* Sets `react/button-has-type` to disabled as this rule [is pretty useless in its current state](https://github.com/yannickcr/eslint-plugin-react/issues/1555).
* Adds an exception for translators comments in `capitalized-comments`.

## 4.0 - 2018-09-07

#### Breaking changes

* Changes all warnings added in 3.0 to errors.
* Adds error for missing textdomain in `__`, `_n`, `_x`, `_nx`.
* Adds errors and warnings for JSX a11y rules.

##  3.1 - 2018-08-28

#### Added

* Adds warning when JSDoc is missing on all symbols.
* Adds warnings for JSX that make sense for our codestyle.
* Adds `keyword-spacing` rule as a warning.
* Adds warning for `no-shadow` rule.
* Adds warning for `prefer-const` rule.

#### Changed

* Bumps `ecmaVersion` up to 2018 so the parser doesn't error when it encounters newer syntax.
