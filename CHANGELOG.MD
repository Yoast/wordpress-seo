# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 2.8.0: July 25th, 2017

### Changed

* Improved README.md to instruct on using yarn instead of npm.

## 2.7.0: July 6th, 2017

### Added

* [AlgoliaSearch] Added Algolia Search as a new component.
* Adds additional colors

## 2.6.0:

### Changed

* Changes the color blue from #0075b3 to #0066cd.

## 2.5.0: 

### Added

* [ConfigurationWizard] Adds possibility to disable navigation on a step page
* [ConfigurationWizard] Adds icons to next, previous and close buttons
* [ConfigurationWizard] Pass `nextStep` and `previousStep` functions to Steps
* Adds Colors for use in my.yoast

## 2.4.0: February 14th, 2016

### Added

* [Choice] Adds a radio button option to the Choice components.

### Removed

* [StyledSection] Removes width from StyledSection to be usable in different contexts.

## 2.3.0: January 17th, 2016

### Changed

* Removes width from StyledSection.

## 2.2.0: December 13th, 2016
 
### Added

* [Loader] Adds Loader component to be used when something is occurring in the background.

## 2.1.0: November 29th, 2016

### Added

* Adds Sass and JSON colors palette.
* Adds `grunt-scss-to-json` package to generate the JSON colors file.

### Changed

* Splits color schemes in a separate Sass file.
* Splits snippet preview colors in a separate Sass file.
* Removes, updates, and adds colors. See the related issue for a [list of colors changes](https://github.com/Yoast/yoast-components/issues/106).
* Adds 2.0.0 as a possibility for react-tap-plugin as a peer dependency.

## 2.0.0: October 20th, 2016

### Breaking changes

* Changed default server request from a PUT to a POST request.

## 1.1.0: October 11th, 2016

### Added

* [StyledSection] Adds a StyledSection component. This component is used to render a HTML section including a heading with an icon.
* [CSS] Adds the `file-text-o` font awesome icon.
* [utils] Exports flat `translate` function in the i18n util.

### Fixed

* [Label] Adds an `aria-label` attribute.
* [Choice] Passes the screenReaderText to the label as `aria-label`.

## 1.0.0: September 27th, 2016

### Added

* Implements HTML component. This component is used to render HTML.
* Implements Choice component. This component is used for a choice, like a group of radio buttons or a select box.
* Implements Input component. This component is used to render a text input.
* Implements Wizard component. This component is used to make a wizard from steps that include fields.
* Implements ScreenReaderText component. This component is used to create a text for use with screen readers.
* Implements ScreenReaderShortcut component. This component is used for skipping navigation to screen reader texts.
* Implements Stepper component. This component is used to create step navigation in the wizard.
* Implements StepButton component. This component is used to access a Step in the wizard.
