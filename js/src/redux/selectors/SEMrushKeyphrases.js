/**
 * Gets the current keywords within the state.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Current keywords.
 */
export function getKeywords( state ) {
	return state.SEMrushKeyphrases;
}
