# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 2.0.0 March 16th, 2026
### Enhancements
* Update styling to match settings styling. [#20905](https://github.com/Yoast/wordpress-seo/pull/20905)
* Adds a button container around the buttons: insert, slot and filterable buttons. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)
* Updates the replacement variables buttons style. [#22580](https://github.com/Yoast/wordpress-seo/pull/22580)
* Adds the `yoast.replacementVariableEditor.additionalButtons` filter for adding extra buttons. [#20546](https://github.com/Yoast/wordpress-seo/pull/20546)

### Other:
* Upgrades WP packages to minimum supported WP version 6.7. [#22466](https://github.com/Yoast/wordpress-seo/pull/22466)

### Non user facing
* Now published as a transpiled package.
* Bumps `@yoast/eslint-config` to version `8.1.0` from `8.0.0`. [#22256](https://github.com/Yoast/wordpress-seo/pull/22256)
* Adds eslint configuration. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Refactors deprecated react life cycle method. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Upgrades react to 18.2.0, Upgrade react test renderer. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Adds missing development dependency on `@yoast/browserslist-config`. [#20916](https://github.com/Yoast/wordpress-seo/pull/20916)
* Migrates enzyme tests to use react testing library. [#20653](https://github.com/Yoast/wordpress-seo/pull/20653)
* Upgrades ESLint and plugins (`import`, `jsx-a11y` and `react`) to the latest versions. [#21315](https://github.com/Yoast/wordpress-seo/pull/21315)
* Bumps `@yoast/ui-library` to version `4.4.0` from `4.3.0`. [#22862](https://github.com/Yoast/wordpress-seo/pull/22862)
* Bumps `@yoast/ui-library` to version `4.5.0` from `4.4.0`. [#23045](https://github.com/Yoast/wordpress-seo/pull/23045)

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
