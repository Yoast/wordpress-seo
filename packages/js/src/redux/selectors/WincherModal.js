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
 * Determines whether there's a keyphrase set.
 *
 * @param {Object} state The state.
 *
 * @returns {bool} Whether a keyphrase is set or not.
 */
export function hasWincherNoKeyphrase( state ) {
	return state.WincherModal.hasNoKeyphrase;
}
