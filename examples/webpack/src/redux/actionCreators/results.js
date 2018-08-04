import * as actions from "../actions/results";

/**
 * An action creator for setting the analyses results.
 *
 * @param {string} results The results.
 *
 * @returns {Object} The action.
 */
export function setResults( results ) {
	return {
		type: actions.SET_RESULTS,
		results,
	}
}
