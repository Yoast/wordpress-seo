import { ReactElement } from "react";
import { BlockInstance, createBlock } from "@wordpress/blocks";
import { createElement } from "@wordpress/element";
import { RequiredBlock } from "../instructions/blocks/dto";

import { getInnerblocksByName, insertBlockToInnerBlock } from "../functions/innerBlocksHelper";
import { getBlockType, removeBlock } from "../functions/blocks";
import { PanelBody, PanelRow } from "@wordpress/components";

/**
 * Renders a required block button.
 *
 * @param {BlockInstance} block             The block to render the button for.
 * @param {string}        requiredBlockName The required block name.
 * @param {boolean}       blockDoesExists   Is the block already added.
 *
 * @returns {ReactElement} The rendered button.
 */
const RequiredBlockButton = ( block: BlockInstance, requiredBlockName: string, blockDoesExists: boolean ): ReactElement => {
	if ( blockDoesExists ) {
		/**
		 * Onclick handler for the remove block.
		 */
		const removeBlockClick = () => {
			const blocksToRemove = getInnerblocksByName( block, [ requiredBlockName ] );
			blocksToRemove.forEach( ( blockToRemove ) => {
				removeBlock( blockToRemove.clientId );
			} );
		};

		return <button className="yoast-block-suggestion-button" onClick={ removeBlockClick }>Remove</button>;
	}

	/**
	 * Onclick handler for the remove block.
	 */
	const addBlockClick = () => {
		const blockToAdd = createBlock( requiredBlockName );
		insertBlockToInnerBlock( blockToAdd, block.clientId );
	};

	return <button className="yoast-block-suggestion-button" onClick={ addBlockClick }>Add</button>;
};

/**
 * Renders a list with the required block names and an button to add/remove one.
 *
 * @param {BlockInstance}   block          The block to render the list for.
 * @param {RequiredBlock[]} requiredBlocks The required blocks.
 *
 * @returns {ReactElement}
 */
export default function RequiredBlocks( block: BlockInstance, requiredBlocks: RequiredBlock[] ): ReactElement {
	// Retrieve a list with names.
	const requiredBlockNames = requiredBlocks.map( ( requiredBlock ) => {
		return requiredBlock.name;
	} );

	const findPresentBlocks = getInnerblocksByName( block, requiredBlockNames );
	const presentBlockNames = findPresentBlocks.map( ( presentBlock ) => {
		return presentBlock.name;
	} );

	const requiredBlockItems: ReactElement[] = [];

	requiredBlockNames.forEach( ( requiredBlockName: string ) => {
		const blockType = getBlockType( requiredBlockName );

		if ( typeof blockType === "undefined" ) {
			return;
		}

		const button = RequiredBlockButton( block, requiredBlockName, presentBlockNames.includes( requiredBlockName ) );

		requiredBlockItems.push( <li className="yoast-block-suggestion">{ blockType.title }{ button }</li> );
	} );

	return (
		<PanelBody title="Required blocks">
			<PanelRow>
				<ul className="yoast-block-suggestions">
					{ requiredBlockItems }
				</ul>
			</PanelRow>
		</PanelBody>
	);
}
