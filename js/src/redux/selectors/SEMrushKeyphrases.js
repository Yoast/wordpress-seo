/**
 * Gets the current keyphrases within the state.
 *
 * @param {Object} state    The state.
 *
 * @returns {Object} Current keyphrases.
 */
export function getSEMrushKeyphrases( state ) {
	return state.SEMrushKeyphrases.keyphrases;
}

/**
 * Gets the current boolean that represents if the limit is reached.
 *
 * @param {Object} state    The state.
 *
 * @returns {boolean} The boolean that represents if the limit is reached.
 */
export function getSEMrushLimitReached( state ) {
	return state.SEMrushKeyphrases.isLimitReached;
}
