import { getBlocks } from "@wordpress/block-editor/store/selectors";
import { BlockInstance } from "@wordpress/blocks";

/**
 * Finds all instances in the editor of a given block name.
 *
 * @param blockName The name of the block to find all instances of, e.g. "core/image".
 * @returns {BlockInstance[]} The matching block instances.
 */
export function getBlocksByBlockName( blockName: string ): BlockInstance[] {
	return getBlocks().filter( block => block.name === blockName );
}
