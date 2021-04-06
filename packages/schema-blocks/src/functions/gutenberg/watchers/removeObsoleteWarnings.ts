import { BlockInstance } from "@wordpress/blocks";
import recurseOverBlocks from "../../blocks/recurseOverBlocks";
import { removeBlock } from "../../BlockHelper";
import { getBlocksByBlockName } from "../../blocks/getBlocksByBlockName";
import { WarningBlockAttributes } from "../../../blocks/warning-block";

/**
 * Removes any warning blocks that no longer apply.
 */
export function removeObsoleteWarnings() {
	// Are any warnings present?
	const currentWarnings = getBlocksByBlockName( "yoast/warning-block" );
	if ( ! currentWarnings ) {
		return;
	}

	// Ask any warnings if they still apply? if not, tell them to go.
	recurseOverBlocks( currentWarnings, ( warning: BlockInstance ) => {
		const attributes = warning.attributes as WarningBlockAttributes;

		if ( ! warningApplies( attributes.removedBlock.name ) ) {
			// The missing block was found; remove it.
			removeBlock( warning.clientId );
		}
	} );
}

/**
 *
 * @param blockName The name of the block that used to trigger a warning.
 * @returns {boolean} True if the warning is still appliccable.
 */
export function warningApplies( blockName: string ): boolean {
	return getBlocksByBlockName( blockName ).length < 1;
}
