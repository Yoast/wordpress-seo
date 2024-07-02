# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.

We follow [Semantic Versioning](http://semver.org/).

## Future Release
### Non user facing
* Now published as a transpiled package.

## 0.16.0 March 15th, 2021
### Bugfixes
* Fixes a bug where the `wicked-good-xpath` package would be missing because it was set as a development dependency.

## 0.14.0 October 26th, 2020
### Enhancements
* Adds `join` that filters an array with Boolean and then joins it.
* Duplicates wordBoundaries, stripSpaces and html.js from `yoastseo`.

## 0.13.0 July 20th, 2020
### Enhancements
* Adds functions to validate Facebook/Twitter images.

## 0.12.0 May 11th, 2020
### Added
* Adds a file that can be used to modify hidden inputs.

## 0.3.0 May 27th, 2019

### Added
* Adds `createSvgIconComponent` function to create a `SvgIcon` component with custom icons.

## 0.2.0 May 14th, 2019

### Changed
* Removes the `createComponentWithIntl` component.

## 0.1.0 April 29th, 2019

### Added
* Splits out `@yoast/helpers` from `yoast-components`. The helpers package contains helper functions required for multiple other `@yoast` packages.
* Improved handling of the `rel` attribute for links that open in a new browser's tab.
