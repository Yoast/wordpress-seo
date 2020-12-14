import { BlockInstance } from "@wordpress/blocks";
import {dispatch, select} from "@wordpress/data";
import recurseOverBlocks from "./blocks/recurseOverBlocks";

/**
 * Searches recursively in the inner blocks to get all instances of blocks whose name occurs in blockNames.
 *
 * @param blockNames     The names of the blocks you're searching for.
 * @param blockInstances The array of blocks you're searching in.
 *
 * @returns {BlockInstance[]} The block instances that have a name that occurs in blockNames.
 */
function getInnerblocksByName( blockNames: string[], blockInstances: BlockInstance[] ): BlockInstance[] {
	const foundBlocks: BlockInstance[] = [];

	recurseOverBlocks( blockInstances, ( block: BlockInstance ) => {
		// Checks if the current block is one of the required types.
		if ( blockNames.includes( block.name ) ) {
			foundBlocks.push( block );
		}
	} );

	return foundBlocks;
}

/**
 * Gets the inner blocks of the block with the given clientId from the core/block-editor store.
 *
 * @param clientId The clientId of the block whose InnerBlocks you want.
 *
 * @returns {BlockInstance[]} The block's inner blocks.
 */
function getInnerBlocks( clientId: string ): BlockInstance[] {
	/* istanbul ignore next */
	return select( "core/block-editor" ).getBlock( clientId ).innerBlocks;
}
/**
 * Inserts a block to the inner block.
 *
 * @param {BlockInstance} block    The block to insert.
 * @param {string}        clientId Id of the element to insert the block to.
 * @param {number}        index    The location of the block.
 */
function insertBlockToInnerBlock( block: BlockInstance, clientId: string, index?: number ) {
	// @ts-ignore
	dispatch( "core/block-editor" ).insertBlocks( block, index, clientId );
}

export { getInnerBlocks, getInnerblocksByName, insertBlockToInnerBlock };
