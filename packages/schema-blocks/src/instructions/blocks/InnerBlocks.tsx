import { maxBy } from "lodash";
import { ComponentType, ReactElement } from "react";
import { createElement, Fragment } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks } from "@wordpress/block-editor";
import { BlockInstance } from "@wordpress/blocks";
import { BlockInstruction, BlockLeaf } from "../../core/blocks";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { BlockValidationResult } from "../../core/validation";
import { getBlockByClientId } from "../../functions/BlockHelper";
import BlockAppender from "../../functions/presenters/BlockAppender";
import { InnerBlocksSidebar } from "../../functions/presenters/InnerBlocksSidebar";
import validateInnerBlocks from "../../functions/validators/innerBlocksValid";
import { InnerBlocksInstructionOptions } from "./InnerBlocksInstructionOptions";

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

		if ( this.options.appender ) {
			properties.renderAppender = this.renderAppender( props.clientId, this.options.appenderLabel );
		} else {
			properties.renderAppender = false;
		}

		this.arrangeAllowedBlocks( properties );

		if ( this.options.template ) {
			properties.template = this.options.template;
		}

		return createElement( WordPressInnerBlocks, properties as WordPressInnerBlocks.Props );
	}

	/**
	 * Renders the appender to add innerblocks as React elements.
	 *
	 * @param clientId The clientId of this block.
	 * @param label The label to show next to the appender..
	 *
	 * @returns The block appender function.
	 */
	private renderAppender( clientId: string, label: string ) {
		return () => createElement(
			BlockAppender,
			{ clientId, label },
		);
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

		let requiredBlockNames: string[] = [];
		if ( this.options.requiredBlocks ) {
			requiredBlockNames = this.options.requiredBlocks.map( block => block.name );
		}

		let recommendedBlockNames: string[] = [];
		if ( this.options.recommendedBlocks ) {
			recommendedBlockNames = this.options.recommendedBlocks.map( block => block.name );
		}

		if ( requiredBlockNames.length < 1 && recommendedBlockNames.length < 1 ) {
			return null;
		}

		return (
			<Fragment key="innerblocks-sidebar">
				<InnerBlocksSidebar
					currentBlock={ currentBlock }
					requiredBlocks={ requiredBlockNames }
					recommendedBlocks={ recommendedBlockNames }
				/>
			</Fragment>
		);
	}

	/**
	 * Checks if the InnerBlock and it's schildren are valid.
	 *
	 * @param blockInstance The block instance being validated.
	 *
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		const issues = validateInnerBlocks( blockInstance, this.options.requiredBlocks, this.options.recommendedBlocks );

		// If no issues are found in any of the innerblocks, the Innerblock is valid too.
		if ( ! issues || issues.length < 1 ) {
			return BlockValidationResult.Valid( blockInstance, this.constructor.name );
		}

		// Make sure to report the worst problem we've found.
		const worstCase: BlockValidationResult = maxBy( issues, issue => issue.result );
		const validation = new BlockValidationResult( blockInstance.clientId, this.constructor.name, worstCase.result, worstCase.blockPresence );
		validation.issues = issues;

		return validation;
	}
}

BlockInstruction.register( "inner-blocks", InnerBlocks );
