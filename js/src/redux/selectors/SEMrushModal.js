/**
 * Gets the current modal status.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Current modal status.
 */
export function getSEMrushModalIsOpen( state ) {
	return state.SEMrushModal.isModalOpen;
}

/**
 * Gets the current country status.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Current country status.
 */
export function getSEMrushSelectedCountry( state ) {
	return state.SEMrushModal.currentDatabase;
}
