import { BlockInstance } from "@wordpress/blocks";
import { select } from "@wordpress/data";

/**
 * Gets the inner blocks of the block with the given clientId from the core/block-editor store.
 *
 * @param clientId The clientId of the block you want.
 *
 * @returns {BlockInstance} The block you want.
 */
function getBlockByClientId( clientId: string ): BlockInstance {
	/* istanbul ignore next */
	return select( "core/block-editor" ).getBlock( clientId );
}

export { getBlockByClientId };
