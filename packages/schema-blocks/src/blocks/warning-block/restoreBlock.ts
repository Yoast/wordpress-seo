import { createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";

/**
 * Restores the recommended or required block that had just been removed.
 *
 * @param {string} clientId          The client ID of the warning block.
 * @param {string} removedBlock      The name of the removed block.
 * @param {object} removedAttributes The attributes of the removed block.
 */
export default function restoreBlock( clientId: string, removedBlock: string, removedAttributes: object ): void {
	const block = createBlock( removedBlock, removedAttributes );
	dispatch( "core/editor" ).replaceBlock( clientId, block );
}
