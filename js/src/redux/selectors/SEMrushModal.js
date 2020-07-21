/**
 * Gets the current modal status - open or closed.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Current modal status.
 */
export function getSEMrushModalOpen( state ) {
	return state.SEMrushModal.whichModalOpen;
}

/**
 * Gets the currently selected country.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Current country.
 */
export function getSEMrushSelectedCountry( state ) {
	return state.SEMrushModal.currentDatabase;
}
