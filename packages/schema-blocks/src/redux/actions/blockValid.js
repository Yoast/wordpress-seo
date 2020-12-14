export const SET_BLOCK_VALID = "SET_BLOCK_VALID";

/**
 * Updates whether a Schema block is valid.
 *
 * @param {string} clientID     The client ID of the Schema block.
 * @param {boolean} validStatus Whether or not the Schema block is valid.
 *
 * @returns {Object} An action for redux.
 */
export function setBlockIsValid( clientID, validStatus ) {
	return {
		type: SET_BLOCK_VALID,
		clientID: clientID,
		validStatus: validStatus,
	};
}
