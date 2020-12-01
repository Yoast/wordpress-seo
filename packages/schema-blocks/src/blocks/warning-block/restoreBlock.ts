import { createBlock } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";

/**
 * Restores the recommended or required block that had just been removed.
 *
 * @param {string} removedBlock      The name of the removed block.
 * @param {object} removedAttributes The attributes of the removed block.
 */
export function restoreBlock( removedBlock: string, removedAttributes: object ): void {
	const block = createBlock( removedBlock, removedAttributes );
	dispatch( "core/editor" ).insertBlocks( [ block ] );
}
