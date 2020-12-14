import { select, dispatch } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";
import { setBlockIsValid } from "../../redux/actions/blockValid";

/**
 * Updates the store with information about whether a block is valid or not.
 */
export default function updateValidStatus( blocks: BlockInstance[] ) {

	function dispatch( action ) {
		this._store.dispatch( action );
	}

	function updateStore() {

		console.log("Updating the store with the block's valid status.");

		// To do: validate the blocks for real (not here).
		// Here, I'm mocking a block's valid status to be false, in order to implement updating the store.
		const validStatus = false;

		// const block = blocks[ 0 ];
		// console.log(block.clientId);

		for (let i = 0; i < blocks.length; i++) {
			console.log(i);
			const block = blocks[i];
			console.log(block.clientId);

			// dispatch( "block-editor" ).updateBlockAttributes( block.clientId, { "yoast-block-valid": validStatus } );
			dispatch( setBlockIsValid( block.clientId, validStatus ) );
		}
	}
}
