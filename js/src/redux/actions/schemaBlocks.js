const PREFIX = "WPSEO_";

export const SET_BLOCK_VALID = `${ PREFIX }SET_BLOCK_VALIDATION`;
export const SET_INNER_BLOCK_VALID = `${ PREFIX }SET_BLOCK_VALIDATION`;

/**
 * Updates whether a block is valid.
 *
 * @param {string} clientID   The client ID of the block.
 * @param {string} blockName  The block name.
 * @param {object} validation The validation result for the block.
 *
 * @returns {object} An action for redux.
 */
export function setBlockValidation( clientID, blockName, validation ) {
	return {
		type: SET_BLOCK_VALID,
		clientId: clientID,
		blockName: blockName,
		validation: validation,
	};
}

export function setInnerBlockValidation( parentClientId, blockName, validation ) {
	return {
		type: SET_INNER_BLOCK_VALID,
		parentClientId,
		blockName,
		validation,
	};
}
