import { createElement, ComponentClass } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import recurseOverBlocks from "../../functions/blocks/recurseOverBlocks";
export type RequiredBlockCollection = Record<string, RequiredBlockOption>
enum RequiredBlockOption {
	one = 1,
	OneOrMore = 2
}

/**
 * InnerBlocks instruction
 */
class InnerBlocks extends BlockInstruction {
	public options: {
		allowedBlocks: string[];
		appender: string;
		appenderLabel: string;		
		requiredBlocks: RequiredBlockCollection;
		recommendedBlocks: string[];
	};

	/**
	 * Renders saving the instruction.
	 *
	 * @returns The inner blocks.
	 */
	save(): JSX.Element {
		return createElement( WordPressInnerBlocks.Content );
	}

	/**
	 * Renders editing the instruction.
	 *
	 * @returns The inner blocks.
	 */
	edit(): JSX.Element {
		const attributes: WordPressInnerBlocks.Props = {};

		if ( this.options.appender === "button" ) {
			attributes.renderAppender = () => {
				// The type definition of InnerBlocks are wrong so cast to fix them.
				return createElement( ( WordPressInnerBlocks as unknown as { ButtonBlockAppender: ComponentClass } ).ButtonBlockAppender );
			};
		} else {
			attributes.renderAppender = () => createElement( WordPressInnerBlocks.DefaultBlockAppender );
		}

		if ( typeof this.options.appenderLabel === "string" ) {
			attributes.renderAppender = () =>
				createElement(
					"div",
					{ className: "yoast-labeled-inserter", "data-label": this.options.appenderLabel },
					[ createElement( ( WordPressInnerBlocks as unknown as { ButtonBlockAppender: ComponentClass } ).ButtonBlockAppender ) ],
				);
		}

		if ( this.options.allowedBlocks ) {
			attributes.allowedBlocks = this.options.allowedBlocks;
		}
		if ( this.options.requiredBlocks ) {
			attributes.requiredBlocks = this.options.requiredBlocks;
		}
		if ( this.options.recommendedBlocks ) {
			attributes.recommendedBlocks = this.options.recommendedBlocks;
		}

		return createElement( WordPressInnerBlocks, attributes );
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param attributes: The attributes from RenderSaveProps or RenderEditProps.
	 * @returns {boolean} True if the instruction block is valid, False if the block contains errors.
	 */
	valid( attributes: object ): boolean {
		if ( this.options.requiredBlocks ) {
			const existingBlocks = this.getBlocksOfType ( this.options.requiredBlocks.keys() );
			const invalids = this.getInvalidBlocks(existingBlocks);

			if (invalids.length > 0) {
				return false;
			}
		}
		
		return true;
	}

	getBlocksOfType (haystack: BlockInstruction[], needles : string[]) : BlockInstruction[] {
		var foundBlocks = BlockInstruction[];
		
		recurseOverBlocks (haystack, ( block : BlockInstruction, ) => {
			// check if the current block is one of the required types
			if (needles.includes(block.name)) {
				
				foundBlocks.push ( block );
			}			
		});
	}

	getInvalidBlocks (existingBlocks: BlockInstruction[]) : BlockInstruction[] {
		const requiredBlocks = this.options.requiredBlocks;
		
		var foundBlocks   = string[];
		var invalidBlocks = string[];

		if ( requiredBlocks ) {
			recurseOverBlocks (existingBlocks, (block : BlockInstruction) => {
				
				// check if the current block is one of the required types
				if (requiredBlocks.containsKey(block.name)) {
					
					// Does this block already exist ? is it allowed to have more than one block of this type?
					if (requiredBlocks[ block.name ] == RequiredBlockOption.one && foundBlocks.contains( block.name )) {
						invalidBlocks.push( block.name );
					}

					// This is the first occurrence, or multiple blocks of this type are allowed.
					foundBlocks.push ( block.name );
				}
			} );
		}

		return invalidBlocks
	}

	getInnerBlocks() : BlockInstruction[] {
		return select( "core/block-editor" ).getBlock( this.options.name ).innerBlocks;
	}
}

BlockInstruction.register( "inner-blocks", InnerBlocks );
