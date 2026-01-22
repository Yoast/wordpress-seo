# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## Future Release
### Enhancements
* Updates the replacement variables buttons style. [#22580](https://github.com/Yoast/wordpress-seo/pull/22580)

### Other:
* Upgrades WP packages to minimum supported WP version 6.7. [#22466](https://github.com/Yoast/wordpress-seo/pull/22466)

### Non user facing
* Now published as a transpiled package.
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)
* Bumps `@yoast/ui-library` to version `4.4.0` from `4.3.0`. [#22862](https://github.com/Yoast/wordpress-seo/pull/22862)

## 1.18.0
### Enhancements
* Adds a new prop `hasPremiumBadge` to the `ReplacementVariableEditor` to display the `PremiumBadge` component.
* Adds classes to the main elements of the `ReplacementVariableEditor` and `Mention` components to allow for individual styling.

## 1.16.0 April 26th, 2021
### Enhancements
* Adds possibility to pass alternative labels for the SEO title and Meta description fields in the SettingsSnippetEditor.

## 1.6.0 October 26th, 2020
### Enhancements
* Adds the `SettingsSnippetEditorFields` and `SettingsSnippetEditor` from `@yoast/search-metadata-previews`.

## 1.4.0 September 17th, 2020
### Bugfixes
* Fixes a bug where the Google preview's variables list would be hidden under the WordPress menu when using a right-to-left language.

## 1.1.0 August 3rd, 2020
### Bugfixes
* Fixes a bug where the styling for the variables in the snippet editors was incorrect.
* Fixes a bug where the placeholder text in the title input field was a different color than the one in the description input field.

## 1.0.0 July 20th, 2020
### Enhancements
* Creates a new package for the Replacement variable editor that is used in the Snippet Preview and the Social Preview.
