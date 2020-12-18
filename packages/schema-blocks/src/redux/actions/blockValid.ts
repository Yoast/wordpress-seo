import { BlockValidationResult } from "../../instructions/blocks/dto";

export const SET_BLOCK_VALID = "SET_BLOCK_VALID";

/**
 * Updates whether a block is valid.
 *
 * @param {string} clientID                   The client ID of the block.
 * @param {BlockValidationResult} validStatus The validation result for the block.
 *
 * @returns {Object} An action for redux.
 */
export function setBlockIsValid( clientID: string, validStatus: BlockValidationResult ): Record<string, string | BlockValidationResult> {
	return {
		type: SET_BLOCK_VALID,
		clientID: clientID,
		validStatus: validStatus,
	};
}
