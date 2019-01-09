const PREFIX = "WPSEO_";

export const SET_MARKER_PAUSE_STATUS = `${ PREFIX }SET_MARKER_PAUSE_STATUS`;

/**
 * Updates the marker pause status boolean.
 *
 * @param {boolean} isMarkerPaused True if the marking is paused.
 *
 * @returns {Object} An action for redux.
 */
export function setMarkerPauseStatus( isMarkerPaused ) {
	return {
		type: SET_MARKER_PAUSE_STATUS,
		isMarkerPaused: isMarkerPaused,
	};
}
