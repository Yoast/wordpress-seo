import { BlockInstance } from "@wordpress/blocks";
import recurseOverBlocks from "../../blocks/recurseOverBlocks";
import { removeBlock } from "../../BlockHelper";
import { WarningBlockAttributes } from "../../../blocks/warning-block";

/**
 * Removes any warning blocks that no longer apply.
 *
 * @param blocks The list of blocks.
 */
export function removeObsoleteWarnings( blocks: BlockInstance[] ) {
	// Are any warnings present?
	const currentWarnings = blocks.filter( block => block.name === "yoast/warning-block" );
	if ( ! currentWarnings ) {
		return;
	}

	// Ask any warnings if they still apply? if not, tell them to go.
	recurseOverBlocks( currentWarnings, ( warning: BlockInstance ) => {
		const attributes = warning.attributes as WarningBlockAttributes;

		if ( ! warningApplies( blocks, attributes.removedBlock.name ) ) {
			// The missing block was found; remove it.
			removeBlock( warning.clientId );
		}
	} );
}

/**
 * Checks if a warning for the block with the given name is still applicable.
 *
 * @param blocks    The list of blocks.
 * @param blockName The name of the block that used to trigger a warning.
 *
 * @returns {boolean} True if the warning is still applicable.
 */
function warningApplies( blocks: BlockInstance[], blockName: string ): boolean {
	return blocks.filter( block => block.name === blockName ).length < 1;
}
