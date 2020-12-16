import { createElement, ComponentClass, Fragment } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, PanelRow } from "@wordpress/components";
import { BlockInstance, TemplateArray, createBlock } from "@wordpress/blocks";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RequiredBlock } from "./dto";
import getInvalidInnerBlocks from "../../functions/validators/innerBlocksValid";
import { InvalidBlockReason } from "./enums";
import { getInnerblocksByName, insertBlockToInnerBlock } from "../../functions/innerBlocksHelper";
import { removeBlock, getBlockType } from "../../functions/blocks";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { getBlockByClientId } from "../../functions/BlockHelper";

/**
 * The InnerBlocks instruction.
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
	edit( props: RenderSaveProps | RenderEditProps ): JSX.Element {
		const properties: WordPressInnerBlocks.Props = {};

		if ( this.options.appender === "button" ) {
			properties.renderAppender = () => {
				// The type definition of InnerBlocks are wrong so cast to fix them haha.
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

		const requiredBlocks: any[] = [];
		const currentBlock = getBlockByClientId( props.clientId );
		if ( this.options.requiredBlocks ) {
			// Get innerblocks for current block.
			const requiredBlockNames = this.options.requiredBlocks.map( ( requiredBlock ) => {
				return requiredBlock.name;
			} );
			const findPresentBlocks = getInnerblocksByName( currentBlock, requiredBlockNames );
			const presentBlockNames = findPresentBlocks.map( ( presentBlock ) => {
				return presentBlock.name;
			} );

			requiredBlockNames.forEach( ( requiredBlockName: string ) => {
				const blockType = getBlockType( requiredBlockName );

				if ( typeof blockType === "undefined" ) {
					return;
				}

				if ( presentBlockNames.includes( requiredBlockName ) ) {
					requiredBlocks.push( createElement( "div", {
						onClick: () => {
							const blocksToRemove = getInnerblocksByName( currentBlock, [ requiredBlockName ] );
							blocksToRemove.forEach( ( blockToRemove ) => {
								removeBlock( blockToRemove.clientId );
							} );
						},
					}, blockType.title + " -" ) );

					return;
				}

				requiredBlocks.push(
					createElement(
						"div",
						{
							onClick: () => {
								const block = createBlock( requiredBlockName );
								insertBlockToInnerBlock( block, props.clientId );
							},
						},
						blockType.title + " +",
					),
				);
			} );
		}

		const requiredBlocksPanel = createElement(
			PanelBody,
			{
				title: "Required blocks",
				children: [
					createElement( PanelRow, {}, ...requiredBlocks ),
				],
			},
		);

		return createElement(
			Fragment,
			{
				children: [
					createElement( WordPressInnerBlocks, properties ),
					createElement( InspectorControls,
						{
							children: [
								requiredBlocksPanel,
							],
						},
					),
				],
			},
		);
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
