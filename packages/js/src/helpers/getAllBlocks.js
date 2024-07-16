/**
 * Returns all Gutenberg blocks given the (current) top-level blocks.
 * @param {object[]} blocks The (current) top-level blocks.
 * @returns {object[]} All blocks.
 */
export const getAllBlocks = ( blocks ) => {
	let allBlocks = [ ...blocks ];

	blocks.forEach( block => {
		if ( block.innerBlocks && block.innerBlocks.length > 0 ) {
			allBlocks = [ ...allBlocks, ...getAllBlocks( block.innerBlocks ) ];
		}
	} );

	return allBlocks;
};
