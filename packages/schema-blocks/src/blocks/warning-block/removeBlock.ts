import { dispatch } from "@wordpress/data";

/**
 * Removes the block with the given ID.
 *
 * @param {string} clientId The ID of the block to remove.
 */
export default function removeBlock( clientId: string ) {
	dispatch( "core/editor" ).removeBlock( clientId );
}
