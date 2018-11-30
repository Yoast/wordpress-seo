const PREFIX = "WPSEO_";

export const SET_MARKER_PAUSE = `${ PREFIX }SET_MARKER_PAUSE`;

/**
 * Updates the marker pause boolean.
 *
 * @param {boolean} isMarkingPaused True if the marking is paused.
 *
 * @returns {Object} An action for redux.
 */
export function setMarkerPause( isMarkingPaused ) {
	return {
		type: SET_MARKER_PAUSE,
		isMarkingPaused: isMarkingPaused,
	};
}
