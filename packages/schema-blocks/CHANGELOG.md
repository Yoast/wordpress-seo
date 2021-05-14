# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 1.8.0 May 17th, 2021
### Enhancements
* Added `Heading` block instruction.
* Adds a header to the sidebar with a link to a blog post about Yoast Structured Data blocks.
* Improves the styling of the sidebar by removing the separators.
* Injects the sidebar of the block into core blocks which are part of the block.
* Watches the post title to continuously check whether it is not equal to the Job Posting title.
* Replaces `OK` in the sidebar by green checkmarks.
* Changes the color of the analysis messages from grey to black.
* Refactors the `BlockValidation` enum to group valid, okay and invalid results into three categories.
* Adds validation logic to the Variation picker instruction, to make it invalid until a variation is picked.
* Simplified schema-blocks validation logic.
* Adds a default tag attribute to the variable rich text instruction, allowing you to set a default tag.
* Shows the variation picker again when a variation is removed.

### Bugfixes
* Fixes a bug where a variation picker would show a second, empty schema block analysis sidebar.
* Fixes a bug where the styling of the sidebar of any warning blocks located inside of a schema block did not have appropriate padding.
* Fixes a bug where the block inserter in the left sidebar crashes when hovering the yoast jobs block icon.
* Fixes a bug where the sidebar of the warning block would not show the schema blocks sidebar elements.
* Fixes the `VariationPickerPresenter: 'key' is not a prop` error that was shown in the browser console when a job posting block had been added.
* Fixed the analysis conclusion message after recent changes in the block validation.
* Fixes some key prop errors in some React components.
* Fixes a bug where Schema output would still be generated if all the required blocks had been valid before, even if they were no longer valid now.
* Fixes a bug where Schema output would be generated even when no variation had been picked for the Location block.
* Fixes a bug where the schema block sidebar would not be correct after it had been added.
* Fixes a bug where the schema analysis would be green even if some required blocks were not filled in.
* Fixes a bug where a placeholder attribute was output on the frontend for instance of the RichText block instruction.

### Other
* Removes a warning block when its removed block is re-added.
* Fixes the styling of the block appender used in the `InnerBlocks` block instruction.

## 1.7.0 April 26th, 2021
### Enhancements
* Adds an orange bullet to the `Analysis` in the side bar when a recommended block is removed.

### Bugfixes
* Fixes a bug where the link to additional information in the warning was missing.

### Other
* Moves the `initialize` function to its own file, to clean up the `index.ts` file of the package.

## 1.6.0 April 1st, 2021
### Enhancements
* Adds the option to set `keepPlaceholderOnFocus` for the RichText field.

### Other
* Adds Inherit-Sidebar instruction.

## 1.5.0 March 15th, 2021
### Bugfixes
* Fixes a bug where the editor would crash when a separator would be generated that clashes with a generated ID in the schema template.

## 1.4.0 February 22nd, 2021
### Enhancements
* Adds a `Date` block instruction for adding dates to a schema block template.
* Sets a placeholder with `Select a date` instead of using today's date as default.
* Adds a processing delay to the Gutenberg subscriber.
* Adds a `TextInput` block instruction for entering a text or number.
* Adds a `SidebarCheckbox` instruction.
* Adds a `JobEmploymentType` instruction.
* Adds a `CurrencySelect` block instruction for selecting a currency.
* Adds a `Variation` and `VariationPicker` instruction, to enable block variations for the structured data blocks.
* Adds a `Valid` method to abstract base classes.
* Adds a panel to the sidebar for recommended blocks.
* Adds a `Select` block instruction. With this instruction, a `select` element can be added to a schema template.
* Adds a basic property validation to the blocks.
* Adds sidebar analysis warnings explaining exactly what is 'wrong' with the user's post.
* Adds support for JSX.
* Adds recursive validation to the `Innerblocks` schema block.
* Adds the possibility to define templates for each `Innerblocks` component.
* Adds the required prepublish script.
* Hides debug logging behind an abstraction.
* Improves the sidebar for Recipe and Job blocks by showing the parent block's sidebar instead of the current block's sidebar.
* Introduces a panel in the sidebar containing the required blocks with the possibility to add a block that isn't added yet.
* Introduces a warning whenever a required or recommended block is removed from a schema block, giving the user the option to restore the block again.

### Bugfixes
* Fixes a bug where the `BlockInstructionLeaf` with could not be instantiated with a null instruction.
* Fixes the styling of block instructions for the Twenty Twenty One WordPress theme.

## 1.1.0 January 11th, 2021
### Enhancements
* Creates a new package for the Schema blocks API that is used for our schema generation.
