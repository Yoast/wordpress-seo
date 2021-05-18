/**
 * Gets the active marker id.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Active marker id.
 */
export function getActiveMarker( state ) {
	return state.activeMarker;
}

/**
 * Gets the marker pause state.
 *
 * @param {Object} state    The state.
 *
 * @returns {boolean} Marker pause state.
 */
export function getMarkerPauseStatus( state ) {
	return state.isMarkerPaused;
}

/**
 * Returns whether marking is available in this context.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether marking is available.
 */
export function isMarkingAvailable( state ) {
	return state.marksButtonStatus === "enabled";
}

/**
 * Gets the marks button status.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The marks button status.
 */
export function getMarksButtonStatus( state ) {
	return state.marksButtonStatus;
}
