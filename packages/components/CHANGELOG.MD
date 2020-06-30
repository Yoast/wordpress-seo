# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.

We follow [Semantic Versioning](http://semver.org/).

## 2.5.0 July 6th, 2020
### Enhancements
* Adds a box shadow and border to the toggle switch.
* Adds a disabled state for the toggle items.
* Adds `type="button"` to all buttons to make sure the default submit behavior is prevented.
* Adds focus styling to button, input, textarea, select and toggle switch components for accessibility.
* Adds the correct border colors for active, hover and focus to the IconLabeledButton.
* Adds `VariableEditorInputContainer` to add caret styles since Draft.js (un)mounts on every focus change.
* Changes all the css variables of the button component to use the Yoast namespacing correctly.
* Updates the input fields, text areas, dropdowns,  buttons, title separator and toggle switches in the settings pages to the new styling.
* Updates the configuration wizard to match the new design.

### Bugfixes
* Fixes a bug where the insights would cause a horizontal scrollbar in the Yoast sidebar.
* Fixes the right-to-left styling for the .yoast-button--buy button.

### Other
* Refactors the code to use another term than 'prominent words', 'keyword suggestions' or 'relevant words'.
* Deprecates the WordList component. A console warning has been added to the component.

## 2.4.0 June 22nd, 2020
### Enhancements
* Adds a new standardized Button class, which can render as a button or as an anchor tag.
* Adds a standardized Primary button and link.
* Adds a standardized Secondary button and link.
* Adds a standardized Upsell button and link.
* Adds a standardized Hide button and link.
* Adds a standardized Remove button and link.
* Adds a standardized Close button and link.
* Adds the HTML and CSS for the secondary, sales, hide and remove buttons.

### Other
* Adds documentation on how to add `@yoast/components` to your project.

## 2.3.0 June 8th, 2020
### Bugfixes
* Fixes a bug where the close button wasn't placed correctly in the metabox modals.
* Fixes a bug where our global CSS variables could conflict with global CSS variables of themes.

## 2.2.0 May 25th, 2020
### Enhancements
* Adds a new DataModel component.
* Changes the Warning component colors to match the new Yoast notification styling.
* Changes the WordOccurrences component in a way that now requires CSS to be loaded. Make sure your JavaScript packager can load CSS.
* Changes the image upload component to be inline with the new Yoast styling.
* Updates HTML and CSS for unexported Toggle and FieldGroup components. ClassName of FieldGroup can now be controlled via props.
* Allows users to set wrapper class and title class on TextInput via wrapperClassName and titleClassName props.

### Bugfixes
* Fixes a bug where the Select's selected option text was too long for the container.
* Fixes a bug where our `select2` styling would overwrite the `select2` styling of other plugins.

## 2.1.0 May 11th, 2020
### Added
* Makes the MultiSelect, Select, RadioButtonGroup, and TextInput available by exporting them from the root.
* Adds colors and icons used in various components.
* Adds HTML and CSS for new title separator component.
* Adds a separate `HelpIcon`.
* Adds an interactive text color to the base colors.
* Adds the Toggle component.
* Adds a new CheckboxGroup component.

### Changed
* Shows the HelpIcon next to a label only if a link (`linkTo`) is provided.
* Updates the HTML of checkbox, input, radiobutton, select and toggle to make styling easier.
* Changes styling for select components.
* Makes select2 full width.

### Fixed
* Fixes a bug where loading the styles from the monorepo would not include styles for the `HelpIcon`.
* Removes some global CSS rules.

## 2.0.0 April 23rd, 2020
### Added
* Adds CSS through JavaScript imports for button, checkbox, data-model, field-group, inputs, modal, radiobutton, select and toggle.
* Adds GenerateId, FieldGroup, TextArea and TextInput components.
* Adds CSS for the primary, secondary and buy buttons.
* Adds a CSS test stub.

### Changed
* Updates the styling of the multiselect.

### Fixed
* Changes the HTML for the modal to improve the accessibility.

## 1.0.0 April 14th, 2020
### Added
* Adds CSS through JavaScript imports for button, checkbox, data-model, field-group, inputs, modal, radiobutton, select and toggle.
* Adds GenerateId, FieldGroup, TextArea and TextInput components.

## 0.14.0 March 30th, 2020
### Added
* Adds CSS and HTML used in the upcoming redesign of the components for borders, colors, icons, buttons, checkbox, data-model, inputs, modal, radio button, select and toggle.

## 0.13.0 January 20th, 2020
### Added
* Adds `className` attribute to the Input component.
* Adds `className` and `optionalAttributes` attributes to the Label component.

## 0.12.0 January 6th, 2020
### Other
* Drops IE11 support through configuring Babel to use the preset environment with the own list of supported browsers specified.

## 0.11.0 November 26th, 2019
### Other
* Removed the components related to the Help Center and the AlgoliaSearch package.

## 0.10.0 November 11th, 2019
### Added
* Improves the `InputField` styling for consistency with the new WordPress 5.3 admin styles.

## 0.8.0 October 14th, 2019
### Other
* Adds a className prop to the AlertContainer.

## 0.7.0 September 30th, 2019
### Added
* Adds an `Alert` component.
* Adds a `MultiStepProgress` component.

## 0.6.0 September 17th, 2019
### Added
* No user-facing changes.

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
