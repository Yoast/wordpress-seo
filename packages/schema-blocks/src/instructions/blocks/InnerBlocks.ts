import { createElement, ComponentClass, Fragment } from "@wordpress/element";
import { InnerBlocks as WordPressInnerBlocks, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, PanelRow } from "@wordpress/components";
import { TemplateArray, createBlock, BlockInstance } from "@wordpress/blocks";
import { dispatch, select } from "@wordpress/data";
import {Component, DetailedReactHTMLElement, ReactElement} from "react";

import BlockInstruction from "../../core/blocks/BlockInstruction";
import { RenderEditProps, RenderSaveProps } from "../../core/blocks/BlockDefinition";
import { RequiredBlock } from "./dto";
import getInvalidInnerBlocks from "../../functions/validators/innerBlocksValid";
import { getInnerBlocks, getInnerblocksByName } from "../../functions/innerBlocksHelper";
import getBlockType from "../../functions/blocks/getBlockType";

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
		const attributes: WordPressInnerBlocks.Props = {};

		if ( this.options.appender === "button" ) {
			attributes.renderAppender = () => {
				// The type definition of InnerBlocks are wrong so cast to fix them haha.
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

		const requiredBlocks: any[] = [];
		if ( this.options.requiredBlocks ) {
			// Get innerblocks for current block.
			const innerBlocks        = getInnerBlocks( props.clientId );
			const requiredBlockNames = this.options.requiredBlocks.map( ( requiredBlock ) => {
				return requiredBlock.name;
			} );
			const findPresentBlocks = getInnerblocksByName( requiredBlockNames, innerBlocks );
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
							const blocksToRemove = getInnerblocksByName( [ requiredBlockName ], innerBlocks );
							blocksToRemove.forEach( ( blockToRemove ) => {
								dispatch( "core/block-editor" ).removeBlock( blockToRemove.clientId );
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
								// @ts-ignore
								dispatch( "core/block-editor" ).insertBlocks( block, null, props.clientId );
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
					createElement( WordPressInnerBlocks, attributes ),
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
