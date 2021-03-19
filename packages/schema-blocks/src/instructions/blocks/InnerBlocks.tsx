import { ComponentType, ReactElement } from "react";
import { createElement, ComponentClass, Fragment } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";
import { BlockInstance } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult } from "../../core/validation";
import BlockInstruction from "../../core/blocks/BlockInstruction";
import validateInnerBlocks from "../../functions/validators/innerBlocksValid";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { getBlockByClientId } from "../../functions/BlockHelper";
import validateMany from "../../functions/validators/validateMany";
import { innerBlocksSidebar } from "../../functions/presenters/InnerBlocksSidebarPresenter";
import { InnerBlocksInstructionOptions } from "./InnerBlocksInstructionOptions";
import BlockLeaf from "../../core/blocks/BlockLeaf";
import {BlockType} from "../../core/validation/BlockValidationResult";

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
	public options: InnerBlocksInstructionOptions;

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
		if ( ! currentBlock ) {
			return null;
		}

		const elements: ReactElement[] = innerBlocksSidebar( currentBlock, this.options );

		if ( elements && elements.length === 0 ) {
			return null;
		}

		return (
			<Fragment key="innerblocks-sidebar">
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
		const validation = new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Unknown, BlockType.Unknown );
		validation.issues = validateInnerBlocks( blockInstance, this.options.requiredBlocks, this.options.recommendedBlocks );

		return validateMany( validation );
	}
}

BlockInstruction.register( "inner-blocks", InnerBlocks );
