const PREFIX = "WPSEO_";

export const SET_BLOCK_VALID = `${ PREFIX }SET_BLOCK_VALIDATION`;

/**
 * Updates whether a block is valid.
 *
 * @param {string} clientID   The client ID of the block.
 * @param {BlockValidation} validation The validation result for the block.
 *
 * @returns {SetBlockValidation} An action for redux.
 */
export function setBlockValidation( clientID, validation ) {
	return {
		type: SET_BLOCK_VALID,
		clientId: clientID,
		validation: validation,
	};
}
