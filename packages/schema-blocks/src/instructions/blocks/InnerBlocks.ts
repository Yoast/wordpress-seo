import { ReactElement } from "react";
import { createElement, ComponentClass } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";
import { BlockInstance, TemplateArray } from "@wordpress/blocks";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RequiredBlock } from "./dto";
import { getInvalidInnerBlocks } from "../../functions/validators";
import { InvalidBlockReason } from "./enums";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";
import { getBlockByClientId } from "../../functions/BlockHelper";
import BlockSuggestions from "../../blocks/BlockSuggestions";

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
		const properties: WordPressInnerBlocks.Props = {};

		if ( this.options.appender === "button" ) {
			properties.renderAppender = () => {
				// The type definition of InnerBlocks are wrong so cast to fix them.
				return createElement( ( WordPressInnerBlocks as unknown as { ButtonBlockAppender: ComponentClass } ).ButtonBlockAppender );
			};
		} else {
			properties.renderAppender = () => createElement( WordPressInnerBlocks.DefaultBlockAppender );
		}

		if ( typeof this.options.appenderLabel === "string" ) {
			properties.renderAppender = () =>
				createElement(
					"div",
					{ className: "yoast-labeled-inserter", "data-label": this.options.appenderLabel },
					[ createElement( ( WordPressInnerBlocks as unknown as { ButtonBlockAppender: ComponentClass } ).ButtonBlockAppender ) ],
				);
		}

		if ( this.options.allowedBlocks ) {
			properties.allowedBlocks = this.options.allowedBlocks;
		}

		if ( this.options.template ) {
			properties.template = this.options.template;
		}

		return createElement( WordPressInnerBlocks, properties );
	}

	/**
	 * Renders the sidebar.
	 *
	 * @param props The props.
	 *
	 * @returns The sidebar element to render.
	 */
	sidebar( props: RenderEditProps ): ReactElement {
		const currentBlock = getBlockByClientId( props.clientId );
		const elements: ReactElement[] = [];

		if ( this.options.requiredBlocks ) {
			elements.push( BlockSuggestions( "Required Blocks", currentBlock, this.options.requiredBlocks.map( block => block.name ) ) );
		}
		if ( this.options.recommendedBlocks ) {
			elements.push( BlockSuggestions( "Recommended Blocks", currentBlock, this.options.recommendedBlocks ) );
		}

		return (
			<Fragment>
			{
				...elements;
			}
			</Fragment>
		);
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The block instance being validated.
	 *
	 * @returns `true` if the instruction block is valid, `false` if the block contains errors.
	 */
	valid( blockInstance: BlockInstance ): boolean {
		const invalidBlocks = getInvalidInnerBlocks( blockInstance, this.options.requiredBlocks );

		return invalidBlocks.length === 0 || invalidBlocks.every( block => block.reason === InvalidBlockReason.Optional );
	}
}

BlockInstruction.register( "inner-blocks", InnerBlocks );
