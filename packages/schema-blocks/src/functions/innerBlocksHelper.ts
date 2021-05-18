import { BlockInstance } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";
import recurseOverBlocks from "./blocks/recurseOverBlocks";

/**
 * Searches recursively in the inner blocks to get all instances of blocks whose name occurs in blockNames.
 *
 * @param blockInstance The array of blocks you're searching in.
 * @param blockNames    The names of the blocks you're searching for.
 *
 * @returns {BlockInstance[]} The block instances that have a name that occurs in blockNames.
 */
function getInnerblocksByName( blockInstance: BlockInstance, blockNames: string[] ): BlockInstance[] {
	return filterBlocksRecursively( blockInstance, block => blockNames.includes( block.name ) );
}

/**
 * Finds all innerblocks of a blockinstance that conform to the predicate.
 *
 * @param blockInstance The block whose innerblocks should be searched
 * @param predicate     The function to decide which blocks should be kept.
 * @returns {BlockInstance[]} The subset of innerblocks that conform to predicate.
 */
function filterBlocksRecursively( blockInstance: BlockInstance, predicate: ( blockInstance: BlockInstance ) => boolean ): BlockInstance[] {
	const foundBlocks: BlockInstance[] = [];

	recurseOverBlocks( blockInstance.innerBlocks, ( block: BlockInstance ) => {
		// Checks if the current block is one of the required types.
		if ( predicate( block ) ) {
			foundBlocks.push( block );
		}
	} );

	return foundBlocks;
}

/**
 * Maps the given callback function over all the blocks (including all innerBlocks) and returns the results as a flat array.
 *
 * @param blocks The blocks.
 * @param callback The callback function.
 *
 * @returns The transformed blocks, in a flat array.
 */
function mapBlocksRecursively<T>( blocks: BlockInstance[], callback: ( block: BlockInstance ) => T ): T[] {
	const result: T[] = [];
	recurseOverBlocks( blocks, ( block: BlockInstance ) => {
		// eslint-disable-next-line callback-return
		result.push( callback( block ) );
	} );
	return result;
}

/**
 * Gathers all the blocks, including inner blocks, in one array of blocks.
 *
 * @param blocks The list of blocks.
 *
 * @returns The list of all blocks.
 */
function getAllBlocks( blocks: BlockInstance[] ): BlockInstance[] {
	return mapBlocksRecursively( blocks, block => block );
}

/**
 * Inserts a block to the inner block.
 *
 * @param {BlockInstance} block    The block to insert.
 * @param {string}        clientId Id of the element to insert the block to.
 * @param {number}        index    The location of the block.
 */
function insertBlock( block: BlockInstance, clientId?: string, index?: number ): void {
	dispatch( "core/block-editor" ).insertBlock( block, index, clientId );
}

export { filterBlocksRecursively, getInnerblocksByName, mapBlocksRecursively, insertBlock, getAllBlocks };
