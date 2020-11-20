import { createElement, ComponentClass, ReactElement } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { RequiredBlock } from "./dto";
import getInvalidInnerBlocks from "../../functions/validators/innerBlocksValid";
import { getInnerBlocks } from "../../functions/innerBlocksHelper";

/**
 * InnerBlocks instruction
 */
export class InnerBlocks extends BlockInstruction {
	public options: {
		allowedBlocks: string[];
		appender: string;
		appenderLabel: string;		
		requiredBlocks: RequiredBlock[];
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

		return createElement( WordPressInnerBlocks, attributes );
	}

	/**
	 * Renders the sidebar.
	 *
	 * @param props The props.
	 * @param i     The number the rendered element is of it's parent.
	 *
	 * @returns The sidebar element to render.
	 */
	sidebar( props: RenderEditProps, i: number ): ReactElement | string {
		var invalidBlocks = getInvalidInnerBlocks( this.options.requiredBlocks, props );
		// todo: loop over all blocks (not just the invalid ones!), add a div to the block depending on their status.
		// block OK? div with a green check,
		// block missing? add button,
		// block occurs too often? remove button,
		// block internal validation? 
		return "todo innerblock sidebar, P2-505, P2-506";
	} 

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param props The properties from the save or edit methods.
	 *
	 * @returns `true` if the instruction block is valid, `false` if the block contains errors.
	 */
	valid( props: RenderSaveProps | RenderEditProps ): boolean {
		var invalidBlocks = getInvalidInnerBlocks( this.options.requiredBlocks, props );	
		
		return invalidBlocks.length === 0 ;
	}
}

BlockInstruction.register( "inner-blocks", InnerBlocks );
