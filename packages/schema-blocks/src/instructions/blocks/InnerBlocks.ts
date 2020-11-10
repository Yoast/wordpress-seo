import { createElement, ComponentClass } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import recurseOverBlocks from "../../functions/blocks/recurseOverBlocks";
import { select } from "@wordpress/data";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { BlockInstance } from "@wordpress/blocks";
export type RequiredBlockCollection = Record<string, RequiredBlockOption>

enum RequiredBlockOption {
	One = 1,
	OneOrMore = 2	
}

export type InvalidBlockCollection = Record <string, InvalidBlockReason>
enum InvalidBlockReason {
	Missing = 1,
	TooMany = 3
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
	 * @param props The properties from the save or edit methods.
	 *
	 * @returns `true` if the instruction block is valid, `false` if the block contains errors.
	 */
	valid( props: RenderSaveProps | RenderEditProps ): boolean {
		if ( this.options.requiredBlocks ) {
			var output : InvalidBlockCollection;

			var innerBlocks = this.getInnerBlocks( props.clientId );
			var keys = Object.keys( this.options.requiredBlocks );
			
			// We now have all instances of required blocks on the page
			const existingBlocks = this.getBlocksOfType ( innerBlocks, keys );
			
			// find all keys that do not have a matching block in existingBlocks
			const missingBlocks = keys.filter( name => { existingBlocks.every ( block => block.name !== name) });			
			missingBlocks.forEach(missing => {
				output[missing] = InvalidBlockReason.Missing;
			});

			var onlyOneAllowed = this.options.requiredBlocks.filter( block => { block.RequiredBlockOption === RequiredBlockOption.One } );
			if (  onlyOneAllowed ) {
				// find all keys that have too many occurrences, by counting the occurrences of each block name.
				var countPerBlockType : Record<string, number> = {};
				existingBlocks.reduce( (countPerBlockType, block) => { 
					countPerBlockType[block.name] = (countPerBlockType[block.name] || 0) + 1;
					return countPerBlockType;
				}, countPerBlockType); 
			}
		}
		
		return true;
	}

	// todo export this neat tool function
	getBlocksOfType (haystack: BlockInstance[], needles : string[]) : BlockInstance[] {
		var foundBlocks : BlockInstance[];
		
		recurseOverBlocks (haystack, ( block : BlockInstance ) => {
			// check if the current block is one of the required types
			if ( needles.includes( block.name )) {
				foundBlocks.push ( block );
			}
		});
		return foundBlocks;
	}


	getInvalidBlocks (existingBlocks: BlockInstance[]) : InvalidBlock[] {
		const requiredBlocks = this.options.requiredBlocks;
		
		var foundBlocks   = string[];
		var invalidBlocks = string[];

		if ( requiredBlocks ) {
			recurseOverBlocks (existingBlocks, (block : BlockInstance) => {
				
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

	getInnerBlocks(clientId : string) : BlockInstance[] {
		return select( "core/block-editor" ).getBlock( clientId ).innerBlocks;
	}
}

BlockInstruction.register( "inner-blocks", InnerBlocks );
