/**
 * Gets the current modal status - open or closed.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current modal status.
 */
export function getWincherModalOpen( state ) {
	return state.WincherModal.whichModalOpen;
}

/**
 * Gets the current display status of empty keyphrase message.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current empty keyphrase message state.
 */
export function getWincherNoKeyphraseMessage( state ) {
	return state.WincherModal.displayNoKeyphraseMessage;
}
