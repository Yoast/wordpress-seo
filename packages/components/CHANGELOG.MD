# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 0.5.0 July 8th, 2019
### Added
* Changes the following improved internal linking functionality (which is disabled by a feature flag by default):
  * Adds the `WordOccurrences component, which is a new visualization for the prominent words.

## 0.4.0 June 11th, 2019
### Added
* Uses feature-flag functionality to determine whether a single word or a multi-word combination should be returned in the `KeywordSuggestions` component. Multi-word remains the default.

## 0.3.0 May 27th, 2019
### Changed
* Changes `SynonymsInput`'s `id` prop to be required.

## 0.2.0 May 14th, 2019
### Fixed
* Fixes a bug where node-sass needed to be installed when adding dependencies that depend on `@yoast/style-guide`.
* Improved handling of the `rel` attribute for links that open in a new browser's tab.

## 0.1.0 April 29th, 2019
### Added
* Splits out `@yoast/components` from `@yoast/yoast-components`. This package contains general components which are mainly used to build other, bigger components.
