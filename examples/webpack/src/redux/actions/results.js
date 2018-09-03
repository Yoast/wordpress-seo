export const SET_RESULTS = "SET_RESULTS";
export const SET_ACTIVE_MARKER = "SET_ACTIVE_MARKER";

/**
 * An action creator for setting the analyses results.
 *
 * @param {string} results The results.
 *
 * @returns {Object} The action.
 */
export function setResults( results ) {
	return {
		type: SET_RESULTS,
		results,
	};
}

export function setActiveMarker( activeMarker ) {
	return {
		type: SET_ACTIVE_MARKER,
		activeMarker,
	};
}
