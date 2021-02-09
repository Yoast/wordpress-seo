import { ReactElement } from "react";
import { createElement, ComponentClass, Fragment, ComponentType } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";
import { BlockInstance, TemplateArray } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult, RecommendedBlock, RequiredBlock } from "../../core/validation";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import validateInnerBlocks from "../../functions/validators/innerBlocksValid";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { getBlockByClientId } from "../../functions/BlockHelper";
import BlockSuggestions from "../../blocks/BlockSuggestions";
import { InstructionObject, InstructionOptions } from "../../core/Instruction";
import BlockLeaf from "../../core/blocks/BlockLeaf";
import validateMany from "../../functions/validators/validateMany";
import { __ } from "@wordpress/i18n";

/**
 * Custom props for InnerBlocks.
 *
 * The definition of the `renderProps` property in the `InnerBlocks.Props` interface
 * is incorrect. It can be `false` to omit the `renderAppender` entirely.
 */
interface InnerBlocksProps extends Omit<WordPressInnerBlocks.Props, "renderAppender"> {
	renderAppender?: ComponentType | false;
}

/**
 * InnerBlocks instruction.
 */
export default class InnerBlocks extends BlockInstruction {
	public options: InstructionOptions & {
		allowedBlocks: string[];
		template: TemplateArray;
		appender: string | false ;
		appenderLabel: string;
		requiredBlocks: RequiredBlock[];
		recommendedBlocks: RecommendedBlock[];
		warnings: InstructionObject;
	}

	/**
	 * Renders saving the instruction.
	 *
	 * @param props The props.
	 * @param leaf  The leaf.
	 * @param i     The index.
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
	 * @param leaf  The leaf.
	 * @param i     The index.
	 *
	 * @returns The inner blocks.
	 */
	edit( props: RenderEditProps, leaf: BlockLeaf, i: number ): ReactElement | string {
		const properties: React.ClassAttributes<unknown> & InnerBlocksProps = {
			key: i,
		};

		this.options.requiredBlocks = this.options.requiredBlocks || [];
		this.options.recommendedBlocks = this.options.recommendedBlocks || [];

		this.renderAppender( properties );

		this.arrangeAllowedBlocks( properties );

		if ( this.options.template ) {
			properties.template = this.options.template;
		}

		return createElement( WordPressInnerBlocks, properties as WordPressInnerBlocks.Props );
	}

	/**
	 * Renders the appender to add innerblocks as React elements.
	 *
	 * @param properties The properties of the innerblock.
	 */
	private renderAppender( properties: React.ClassAttributes<unknown> & InnerBlocksProps ) {
		if ( this.options.appender === false ) {
			properties.renderAppender = false;
			return;
		}

		if ( this.options.appender === "button" ) {
			properties.renderAppender = () => {
				// The type definition of InnerBlocks are wrong so cast to fix them.
				return createElement( ( WordPressInnerBlocks as unknown as { ButtonBlockAppender: ComponentClass } ).ButtonBlockAppender );
			};
		} else {
			properties.renderAppender = () => createElement( WordPressInnerBlocks.DefaultBlockAppender );
		}

		if ( typeof this.options.appenderLabel === "string" ) {
			properties.renderAppender = () => {
				return createElement(
					"div",
					{ className: "yoast-labeled-inserter", "data-label": this.options.appenderLabel },
					// The type definition of InnerBlocks are wrong so cast to fix them.
					createElement( ( WordPressInnerBlocks as unknown as { ButtonBlockAppender: ComponentClass } ).ButtonBlockAppender ),
				);
			};
		}
	}

	/**
	 * Ensures all required and recommended blocks are allowed blocks.
	 *
	 * @param properties The properties of the current block.
	 */
	private arrangeAllowedBlocks( properties: React.ClassAttributes<unknown> & InnerBlocksProps ) {
		properties.allowedBlocks = [ "yoast/warning-block" ];

		if ( this.options.allowedBlocks ) {
			properties.allowedBlocks = this.options.allowedBlocks.concat( properties.allowedBlocks );
		}

		properties.allowedBlocks = properties.allowedBlocks
			.concat( this.options.requiredBlocks.map( block => block.name ) )
			.concat( this.options.recommendedBlocks.map( block => block.name ) );
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
			elements.push( BlockSuggestions( __( "Required Blocks", "yoast-schema-blocks" ), currentBlock, this.options.requiredBlocks ) );
		}
		if ( this.options.recommendedBlocks ) {
			elements.push( BlockSuggestions( __( "Recommended Blocks", "yoast-schema-blocks" ), currentBlock, this.options.recommendedBlocks ) );
		}

		if ( elements.length === 0 ) {
			return null;
		}

		return (
			<Fragment>
			{ ...elements }
			</Fragment>
		);
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
