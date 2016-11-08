# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 2.0: October 20th, 2016

### Breaking changes

* Changed default server request from a PUT to a POST request.

## 1.1: October 11th, 2016

### Added

* [StyledSection] Adds a StyledSection component. This component is used to render a HTML section including a heading with an icon.
* [CSS] Adds the `file-text-o` font awesome icon.
* [utils] Exports flat `translate` function in the i18n util.

### Fixed

* [Label] Adds an `aria-label` attribute.
* [Choice] Passes the screenReaderText to the label as `aria-label`.

## 1.0: September 27th, 2016

### Added

* Implements HTML component. This component is used to render HTML.
* Implements Choice component. This component is used for a choice, like a group of radio buttons or a select box.
* Implements Input component. This component is used to render a text input.
* Implements Wizard component. This component is used to make a wizard from steps that include fields.
* Implements ScreenReaderText component. This component is used to create a text for use with screen readers.
* Implements ScreenReaderShortcut component. This component is used for skipping navigation to screen reader texts.
* Implements Stepper component. This component is used to create step navigation in the wizard.
* Implements StepButton component. This component is used to access a Step in the wizard.
