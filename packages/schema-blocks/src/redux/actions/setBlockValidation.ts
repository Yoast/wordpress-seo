import { BlockValidation } from "../../core/validation";

export const SET_BLOCK_VALID = "SET_BLOCK_VALID";

/**
 * Updates whether a block is valid.
 *
 * @param {string} clientID            The client ID of the block.
 * @param {BlockValidation} validation The validation result for the block.
 *
 * @returns {Object} An action for redux.
 */
function setBlockValidation( clientID: string, validation: BlockValidation ): Record<string, string | BlockValidation> {
	return {
		type: SET_BLOCK_VALID,
		clientId: clientID,
		validation: validation,
	};
}

export default setBlockValidation;
