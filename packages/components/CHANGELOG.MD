# Change Log

All notable changes to this project will be documented in this file. Releases without a changelog entry contain only minor changes that are irrelevant for users of this library.

We follow [Semantic Versioning](http://semver.org/).

## Future Release
### Other
* Adds a way to change the link in the `WordOccurenceInsights` component.

### Non user facing
* Changes the `imageAltText` prop from the `ImageSelect` component to no longer be required.


## 2.20.0
### Enhancements
* Adds a new `PremiumBadge` component.
* Adds a new prop `hadPremiumBadge` to the `FieldGroup` and `ImageSelect` components.
* Adjusts the CSS of the `NewBadge` component so that it's mostly shared with `PremiumBadge`.
* Improves the support for 16:9 images by the `ImageSelect` component.

### Bugfixes
* Fixes a bug where the ImageSelect did not a have a screen reader text.

## 2.17.0 April 1st, 2021
### Enhancements
* Updates the `Checkbox` component to the newer style. Now wrapped in a `FieldGroup`.
* Adds a maximum width to the `Alert` component.
* Exposes the `CheckboxGroup` Component.

## 2.15.0 February 22nd, 2021
### Bugfixes
* Fixes a bug where the checkbox and radio button components didn't have a focus style.

## 2.14.0 February 8th, 2021
### Enhancements
* Adds a DurationInput component, which can handle the input of a duration in hours, minutes, and seconds.
* Adds an ImageSelect component with an image preview or url preview.

## 2.12.0 January 12th, 2021
### Enhancements
* Adds an InsightCard component.

### Bugfixes
* Fixes a bug where a console error would appear when closing the Google Preview modal.

## 2.11.0 October 26th, 2020
### Bugfixes
* Fixes a bug where the Select's onOptionFocus would not be called.
* Fixes a bug where the Edit variant of the NewButton had a misaligned icon.
* Fixes a bug where the new Button component could not be imported via the package index.

## 2.10.0 October 13th, 2020
### Enhancements
* Adds SingleSelect component, which is based on the MultiSelect implementation.
* Introduces the new table HTML and CSS setup.
* Includes table.css in monorepo.css.

### Bugfixes
* Fixes a bug where the new Button component could not be imported via the package index.
* Fixes a bug where the font size for the field group and the font weight for the table header would not be set correctly.

### Other
* Adds an id to the MultiSelect's input field.
* Adjusts the styling provided for the modal component to use it for the Gutenberg Modal component.

## 2.9.0 September 17th, 2020
### Enhancements
* Changes `TextInput`, `TextArea`, `LabeledRadioButton`, `Select`, and `MultiSelect` to controlled components, their value should be passed from a higher order component.
* Changes the `MultiSelect` implementation to use `react-select` instead of `select2`.
* Introduces `icons.html` for examples on how to use the icons.
* Adds chevron up and chevron down svg icons.

### Bugfixes
* Fixes a bug where removing the last item from the `MultiSelect` generated an error.
* Fixes a bug where the `select2` dropdown would be hidden when used in a modal.

### Other
* Adds styling to the RadioButtons to remove any "before" elements.

## 2.8.0 August 31st, 2020
### Enhancements
* Adds a button with an edit icon.

## 2.7.0 August 17th, 2020
### Enhancements
* Adds a new active schema tab icon.
* Adds an optional buttonRef prop to the Button and ButtonStyledLink, which will be set as a ref on the html button and anchor element, respectively.
* Makes the FieldGroup component available by exporting it. The FieldGroup is a reusable wrapper with a title/label, an optional HelpIcon and an optional Description.
* Opens the 'ultimate guide to keyword research' link from the WordOccurrenceInsights component in a new tab.
* Adds an optional `onOptionFocus` prop to the Select component. When an input event is fired, `onOptionFocus` is called with the select's name, and the current value.

### Other
* Makes the Select name property optional.

## 2.6.0 August 3rd, 2020
### Enhancements
* Adds the means to put a button inline with a select2 element.
* Adds a small class for the buttons and a disabled status for the secondary button.
* Adds a box shadow and border to the toggle switch.
* Adds a disabled state for the toggle items.
* Adds a "small" prop (boolean) to the Button and ButtonStyledLink components for a variant with a lower profile.
* Yoast styled buttons are now available in preset variants, such as `primary`, `secondary`, `buy`, etc.
* Yoast styled links (identically styled to the buttons) are now available in preset variants, such as `primary`, `secondary`, `buy`, etc.
* Updates the input fields, text areas, dropdowns,  buttons, title separator and toggle switches in the settings pages to the new styling.

### Bugfixes
* Fixes a bug where the insights would cause a horizontal scrollbar in the Yoast sidebar.

### Other
* Flips the order of the labels for inverse toggles. To make sure the active state is always on the right.
* Refactors the code to use another term than 'prominent words', 'keyword suggestions' or 'relevant words'.
* Removes the standard WordPress checkmark from our checkmarks.
* Removes internal linking feature flag from the feature branch. Previously hidden functionality will now be the default.
* Deprecates the WordList component. A console warning has been added to the component.

## 2.5.0 July 20th, 2020
### Enhancements
* Adds `type="button"` to all buttons to make sure the default submit behavior is prevented.
* Adds focus styling to button, input, textarea, select and toggle switch components for accessibility.
* Adds the correct border colors for active, hover and focus to the IconLabeledButton.
* Adds `VariableEditorInputCotainer` to add caret styles since Draft.js (un)mounts on every focus change.
* Changes all the css variables of the button component to use the Yoast namespacing correctly.
* Removes border-bottom and margin-top hack from the collapsible.

### Bugfixes
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
