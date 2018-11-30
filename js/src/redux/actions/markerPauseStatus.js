const PREFIX = "WPSEO_";

export const SET_MARKER_PAUSE_STATUS = `${ PREFIX }SET_MARKER_PAUSE_STATUS`;

/**
 * Updates the marker pause status boolean.
 *
 * @param {boolean} isMarkingPaused True if the marking is paused.
 *
 * @returns {Object} An action for redux.
 */
export function setMarkerPauseStatus( isMarkingPaused ) {
	return {
		type: SET_MARKER_PAUSE_STATUS,
		isMarkingPaused: isMarkingPaused,
	};
}
