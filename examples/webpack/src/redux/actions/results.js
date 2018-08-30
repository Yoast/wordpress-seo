export const SET_RESULTS = "SET_RESULTS";

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
