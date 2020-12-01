import { BlockInstance } from "@wordpress/blocks";
import recurseOverBlocks from "./blocks/recurseOverBlocks";

/**
 * Searches recursively in the inner blocks to get all instances of blocks whose name occurs in blockNames.
 *
 * @param blockInstance The block whose InnerBlocks you're searching in.
 * @param blockNames    The names of the blocks you're searching for.
 *
 * @returns {BlockInstance[]} The block instances that have a name that occurs in blockNames.
 */
function getInnerblocksByName( blockInstance: BlockInstance, blockNames: string[] ): BlockInstance[] {
	const foundBlocks: BlockInstance[] = [];

	recurseOverBlocks( blockInstance.innerBlocks, ( block: BlockInstance ) => {
		// Checks if the current block is one of the required types.
		if ( blockNames.includes( block.name ) ) {
			foundBlocks.push( block );
		}
	} );

	return foundBlocks;
}

export { getInnerblocksByName };
