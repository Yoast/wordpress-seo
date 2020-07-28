/**
 * Gets the current modal status - open or closed.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current modal status.
 */
export function getSEMrushModalOpen( state ) {
	return state.SEMrushModal.whichModalOpen;
}

/**
 * Gets the currently selected country.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current country.
 */
export function getSEMrushSelectedCountry( state ) {
	return state.SEMrushModal.currentDatabase;
}

/**
 * Gets the current display status of empty keyphrase message.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current empty keyphrase message state.
 */
export function getSEMrushNoKeyphraseMessage( state ) {
	return state.SEMrushModal.displayNoKeyphraseMessage;
}
