import { createElement, ComponentClass } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { RequiredBlock } from "./dto";
import getInvalidInnerBlocks from "../../functions/validators/innerBlocksValid";
import { TemplateArray } from "@wordpress/blocks";

/**
 * InnerBlocks instruction.
 */
export default class InnerBlocks extends BlockInstruction {
	public options: {
		allowedBlocks: string[];
		template: TemplateArray;
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

		if ( this.options.template ) {
			attributes.template = this.options.template;
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
	sidebar( props: RenderEditProps, i: number ): ReactElement | string {
		// Loop over all blocks (not just the invalid ones!), add a div to the block depending on their status.
		const invalidBlocks = getInvalidInnerBlocks( this.options.requiredBlocks, props.clientId );
		// Block OK? div with a green check,
		// Block missing? add button,
		// Block occurs too often? remove button,
		// Block internal validation?
		const count = ( invalidBlocks || [] ).length;

		// The innerblock sidebar is handled in P2-505, P2-506.
		console.log( "Found " + count + " invalid blocks." );
		return "";
	}*/

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param props The properties from the save or edit methods.
	 *
	 * @returns `true` if the instruction block is valid, `false` if the block contains errors.
	 */
	valid( props: RenderSaveProps | RenderEditProps ): boolean {
		const invalidBlocks = getInvalidInnerBlocks( this.options.requiredBlocks, props.clientId );

		return invalidBlocks.length === 0;
	}
}

BlockInstruction.register( "inner-blocks", InnerBlocks );
