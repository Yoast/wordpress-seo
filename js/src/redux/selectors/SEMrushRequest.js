/**
 * Gets the current request status.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Current request status.
 */
export function getActiveRequestStatus( state ) {
	return state.SEMrushRequest;
}
