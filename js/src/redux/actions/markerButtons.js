const PREFIX = "WPSEO_";

export const SET_MARKER_STATUS = `${ PREFIX }SET_MARKER_STATUS`;

/**
 * An action creator for setting the marker button status.
 *
 * @param {string} markerStatus The markerStatus.
 *
 * @returns {Object} The setting marker button state action.
 */
export const setMarkerStatus = function( markerStatus ) {
	return {
		type: SET_MARKER_STATUS,
		markerStatus: markerStatus,
	};
};
