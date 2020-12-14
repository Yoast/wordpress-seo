import { dispatch } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";

/**
 * Updates the store with information about whether a block is valid or not.
 */
export default function updateValidStatus( blocks: BlockInstance[] ) {
	console.log( "Updating the store with the block's valid status." );

	for ( let i = 0; i < blocks.length; i++ ) {
		console.log( i );
		const block = blocks[ i ];
		console.log( block.clientId );

		// To do: validate the blocks for real (not here).
		// Here, I'm mocking a block's valid status to be false, in order to implement updating the store.
		const validStatus = true;

		dispatch( "yoast-seo/editor" ).setBlockIsValid( block.clientId, validStatus );
	}
}
