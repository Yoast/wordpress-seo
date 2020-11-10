/**
* Runs a function over all blocks, including nested blocks.
*
* @param {Object[]} blocks   The blocks.
* @param {function} callback The callback.
*
* @returns {void}
*/
export default function recurseOverBlocks( blocks, callback ) {
	for ( const block of blocks ) {
		// eslint-disable-next-line callback-return
		callback( block );
		if ( block.innerBlocks ) {
			recurseOverBlocks( block.innerBlocks, callback);
		}
	}
}