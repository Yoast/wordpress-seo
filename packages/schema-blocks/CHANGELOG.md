# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

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

## 1.1.0 January 11th, 2021
### Enhancements
* Creates a new package for the Schema blocks API that is used for our schema generation.
