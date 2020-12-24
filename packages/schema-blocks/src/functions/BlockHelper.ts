import { BlockInstance, createBlock } from "@wordpress/blocks";
import { dispatch, select } from "@wordpress/data";

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

/**
 * Removes a block from the editor.
 *
 * @param {string} clientId The client id of the block to remove.
 */
function removeBlock( clientId: string ) {
	dispatch( "core/block-editor" ).removeBlock( clientId );
}

/**
 * Restores the recommended or required block that had just been removed.
 *
 * @param {string} clientId          The client ID of the warning block.
 * @param {string} removedBlock      The name of the removed block.
 * @param {object} removedAttributes The attributes of the removed block.
 */
function restoreBlock( clientId: string, removedBlock: string, removedAttributes: object ): void {
	const block = createBlock( removedBlock, removedAttributes );
	dispatch( "core/block-editor" ).replaceBlock( clientId, block );
}

/**
 * Finds the block type in the list of registered blocks in the block editor.
 *
 * @param {string} blockName The block to search for.
 *
 * @return {BlockInstruction} The found block.
 */
function getBlockType( blockName: string ) {
	return select( "core/blocks" ).getBlockType( blockName );
}

export { getBlockByClientId, removeBlock, restoreBlock, getBlockType };
