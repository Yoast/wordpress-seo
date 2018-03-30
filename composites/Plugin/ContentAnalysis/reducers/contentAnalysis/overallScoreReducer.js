import { SET_OVERALL_SCORE } from "../../actions/contentAnalysis";

/**
 * A reducer for the score object.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated score object.
 */
export function overallScoreReducer( state, action ) {
	switch ( action.type ) {
		case SET_OVERALL_SCORE:
			return action.results.overallScore;
		default:
			return state;
	}
}