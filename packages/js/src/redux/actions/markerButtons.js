export const SET_MARKER_STATUS = "WPSEO_SET_MARKER_STATUS";

/**
 * An action creator for setting the marks button status.
 *
 * @param {string} marksButtonStatus The marksButtonStatus.
 *
 * @returns {Object} The setting marks button state action.
 */
export const setMarkerStatus = function( marksButtonStatus ) {
	return {
		type: SET_MARKER_STATUS,
		marksButtonStatus: marksButtonStatus,
	};
};
