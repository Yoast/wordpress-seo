# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.
We follow [Semantic Versioning](http://semver.org/).

## 2.11.0 September 14th, 2020
### Bugfixes
* Fixes a bug where the social previews would be able to break out of their container when viewed on smaller screens.

## 2.7.0 July 20th, 2020
### Enhancements
* Removes the replacement variable editor from the code but keep the export for backwards compatibility.

### Bugfixes
* Fixes a bug where the Google and social previews would not strip the HTTPS protocol.

## 2.2.0 April 23rd, 2020
### Added
* Adds a CSS test stub.

## 1.16.0 January 20th, 2020
### Changed
* Enhances the Snippet Editor's Mode Switcher component by using radio buttons.

## 1.15.0 January 6th, 2020
### Other
* Drops IE11 support through configuring Babel to use the preset environment with the own list of supported browsers specified.

## 1.13.0 November 25th, 2019
### Fixes
 * Fixes a bug where non-square images would be distorted in the mobile snippet preview.

## 1.12.0 November 11th, 2019
### Fixes
 * Fixes a bug where the Snippet Preview elements had misplaced visually hidden text.

## 1.11.0 October 29th, 2019
### Enhancements:
 * Increases the specificity of the width and height CSS of the `MobileDescriptionImage`.

## 1.8.0 September 17th, 2019
### Enhancements
* Changes desktop snippet preview to match Google's new font sizes. [#345](https://github.com/Yoast/javascript/pull/345)

## 1.4.0 June 24th, 2019
### Changed
* Updates the Google Mobile Snippet Preview.

## 1.0.0 April 29th, 2019
### Added
* Splits out `@yoast/search-metadata-previews` from `yoast-components`. The search metadata previews package contains previews for search platforms such as Google.
