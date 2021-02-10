# Change Log

This changelog is according to [Keep a Changelog](http://keepachangelog.com).

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 1.4.0 February 22nd, 2021
### Enhancements
* Adds a Date block instruction for adding dates to a schema block template.
* Adds a processing delay to the Gutenberg subscriber.
* Adds a `TextInput` block instruction for entering a text or number.
* Adds a `SidebarCheckbox` instruction.
* Adds a `JobEmploymentType` instruction.
* Adds a `CurrencySelect` block instruction for selecting a currency.
* Adds a `Variation` and `VariationPicker` instruction, to enable block variations for the structured data blocks.
* Adds a "Valid" method to abstract base classes.
* Adds a panel to the sidebar for Recommended blocks.
* Adds a `Select` block instruction to the schema-blocks package. With this instruction, a `select` element can be added to a schema template.
* Adds a basic property validation to the blocks.
* Adds sidebar analysis warnings explaining exactly what is 'wrong' with the user's post.
* Adds support for JSX to the schema-blocks package.
* Adds recursive validation to the `Innerblocks` schema block.
* Adds the possibility to define templates for each `Innerblocks` component.
* Adds the required prepublish script to the schema-blocks package.
* Hides debug logging behind an abstraction.
* Introduces a panel in the sidebar containing the required blocks with the possibility to add a block that isn't added yet.
* Introduces a warning whenever a required or recommended block is removed from a schema block, giving the user the option to restore the block again.

## 1.1.0 January 11th, 2021
### Enhancements
* Creates a new package for the Schema blocks API that is used for our schema generation.
