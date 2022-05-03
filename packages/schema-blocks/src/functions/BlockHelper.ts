import { Block, BlockInstance } from "@wordpress/blocks";
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
function removeBlock( clientId: string ): void {
	dispatch( "core/block-editor" ).removeBlock( clientId );
}

/**
 * Restores the recommended or required block that had just been removed.
 *
 * @param {string} clientId          The client ID of the warning block.
 * @param {string} removedBlock      The removed block.
 */
function restoreBlock( clientId: string, removedBlock: BlockInstance ): void {
	dispatch( "core/block-editor" ).replaceBlock( clientId, removedBlock );
}

/**
 * Finds the block type in the list of registered blocks in the block editor.
 *
 * @param {string} blockName The block to search for.
 *
 * @return {BlockInstruction} The found block.
 */
function getBlockType( blockName: string ): Block | undefined {
	return select( "core/blocks" ).getBlockType( blockName );
}

/**
 * Retrieves a human readable block name.
 *
 * @param blockName The block name (e.g. the Gutenberg block id).
 *
 * @returns A human readable block title.
 */
function getHumanReadableBlockName( blockName: string ): string {
	const blockType = getBlockType( blockName ) || null;
	if ( blockType ) {
		return blockType.title;
	}

	const lastSlash = blockName.lastIndexOf( "/" );
	if ( lastSlash < 0 || lastSlash === blockName.length - 1 ) {
		return blockName;
	}

	return blockName.substring( lastSlash + 1 ).toLocaleLowerCase();
}

export { getBlockByClientId, removeBlock, restoreBlock, getBlockType, getHumanReadableBlockName };
