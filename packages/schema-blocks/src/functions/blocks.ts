import { dispatch, select } from "@wordpress/data";

/**
 * Gets attributes of inner blocks.
 *
 * @param clientId The client ID of the parent block.
 * @param blocks   A mapping of block name to attribute key.
 *
 * @returns An array contain block names and values.
 */
export function getInnerBlocksAttributes( clientId: string, blocks: Record<string, string> ): { name: string; value: unknown }[] {
	let innerBlocks = select( "core/block-editor" ).getBlock( clientId ).innerBlocks;
	innerBlocks     = innerBlocks.filter( block => block.name in blocks );

	const values = [];

	for ( const block of innerBlocks ) {
		const key   = blocks[ block.name ];
		values.push( { name: block.name, value: block.attributes[ key ] } );
	}

	return values;
}

/**
 * Removes a block from the editor.
 *
 * @param {string} clientId The client id of the block to remove.
 */
export function removeBlock( clientId: string ) {
	dispatch( "core/block-editor" ).removeBlock( clientId );
}
