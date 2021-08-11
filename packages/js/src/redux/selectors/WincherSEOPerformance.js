/**
 * Gets the current tracking status.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current tracking status.
 */
export function getWincherIsTracking( state ) {
	return state.WincherSEOPerformance.isTracking;
}

/**
 * Gets the current tracking status of the keyphrase.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current tracking status of the keyphrase.
 */
export function getWincherIsTrackingKeyphrase( state ) {
	return state.WincherSEOPerformance.isTrackingKeyphrase;
}

/**
 * Gets the keyphrase that may be tracked.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The keyphrase.
 */
export function getWincherTrackableKeyphrase( state ) {
	return state.WincherSEOPerformance.trackableKeyphrase;
}

/**
 * Gets the currently tracked keyphrases.
 *
 * @param {Object} state The state.
 *
 * @returns {array} The currently tracked keyphrases.
 */
export function getWincherTrackedKeyphrases( state ) {
	return state.WincherSEOPerformance.trackedKeyphrases;
}
