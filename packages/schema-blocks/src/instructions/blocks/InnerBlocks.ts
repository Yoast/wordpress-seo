import { ReactElement } from "react";
import { createElement, ComponentClass } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";
import { BlockInstance, TemplateArray } from "@wordpress/blocks";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RecommendedBlock, RequiredBlock } from "./dto";
import { getInvalidInnerBlocks } from "../../functions/validators";
import { InvalidBlockReason } from "./enums";
import { RenderEditProps } from "../../core/blocks/BlockDefinition";
import { getBlockByClientId } from "../../functions/BlockHelper";
import RequiredBlocks from "../../blocks/RequiredBlocks";
import { InstructionObject } from "../../core/Instruction";

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
		recommendedBlocks: RecommendedBlock[];
		warnings: InstructionObject;
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

		properties.allowedBlocks = [ "yoast/warning-block" ];

		if ( this.options.allowedBlocks ) {
			properties.allowedBlocks = this.options.allowedBlocks.concat( properties.allowedBlocks );
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
	sidebar( props: RenderEditProps ): ReactElement | string {
		const currentBlock = getBlockByClientId( props.clientId );

		if ( this.options.requiredBlocks ) {
			return RequiredBlocks( currentBlock, this.options.requiredBlocks );
		}

		return "";
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
