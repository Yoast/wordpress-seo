import { BlockInstance } from "@wordpress/blocks";

/**
* Runs a function over all blocks, including nested blocks.
*
* @param {BlockInstance[]} blocks   The blocks.
* @param {function} callback The callback.
*
* @returns {void}
*/
export default function recurseOverBlocks( blocks: BlockInstance[], callback: Function ) {
	for ( const block of blocks ) {
		// eslint-disable-next-line callback-return
		callback( block );
		if ( block.innerBlocks ) {
			recurseOverBlocks( block.innerBlocks, callback );
		}
	}
}
