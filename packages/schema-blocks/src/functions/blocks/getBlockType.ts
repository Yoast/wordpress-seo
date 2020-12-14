import { select } from "@wordpress/data";

/**
 * Finds the block type in the list of registered blocks in the block editor.
 *
 * @param {string} blockName The block to search for.
 *
 * @return {BlockInstruction} The found block.
 */
export default function getBlockType( blockName: string ) {
	return select( "core/blocks" ).getBlockType( blockName );
}
