import { ReactElement } from "react";
import { createElement, ComponentClass } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";
import { BlockInstance, TemplateArray } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult, RecommendedBlock, RequiredBlock } from "../../core/validation";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import validateInnerBlocks from "../../functions/validators/innerBlocksValid";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { getBlockByClientId } from "../../functions/BlockHelper";
import RequiredBlocks from "../../blocks/RequiredBlocks";
import { InstructionObject } from "../../core/Instruction";
import BlockLeaf from "../../core/blocks/BlockLeaf";
import validateMany from "../../functions/validators/validateMany";

/**
 * InnerBlocks instruction.
 */
export default class InnerBlocks extends BlockInstruction {
	public options: {
		name: string;
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
	 * @param props The props.
	 * @param leaf The leaf.
	 * @param i The index.
	 *
	 * @returns The inner blocks.
	 */
	save( props: RenderSaveProps, leaf: BlockLeaf, i: number ): ReactElement | string {
		return createElement( WordPressInnerBlocks.Content, { key: i } );
	}

	/**
	 * Renders editing the instruction.
	 *
	 * @param props The props.
	 * @param leaf The leaf.
	 * @param i The index.
	 *
	 * @returns The inner blocks.
	 */
	edit( props: RenderEditProps, leaf: BlockLeaf, i: number ): ReactElement | string {
		const properties: React.ClassAttributes<unknown> & WordPressInnerBlocks.Props = {
			key: i,
		};

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
					createElement( ( WordPressInnerBlocks as unknown as { ButtonBlockAppender: ComponentClass } ).ButtonBlockAppender ),
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

		return null;
	}

	/**
	 * Checks if the instruction block is valid.
	 *
	 * @param blockInstance The block instance being validated.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const validation = new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Unknown );
		validation.issues = validateInnerBlocks( blockInstance, this.options.requiredBlocks );
		return validateMany( validation );
	}
}

BlockInstruction.register( "inner-blocks", InnerBlocks );
