import { SET_OVERALL_READABILITY_SCORE, SET_OVERALL_SEO_SCORE } from "../../actions/contentAnalysis";

/**
 * Initial state
 */
const initialState = {};

export function setOverallReadabilityScore( state, action ) {
	return Object.assign( {}, state,
		{ overallScore: action.overallScore }
	);
}

/**
 * Sets the overall score for SEO results for a keyword.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 * @returns {Object} The overall score for the keyword.
 */

export function setOverallSeoScore( state, action ) {
	return Object.assign( {}, state[ action.keyword ], {
		overallScore: action.overallScore,
	} );
}

/**
 * A reducer for the score object.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated score object.
 */
export function overallScoreReducer( state = initialState, action ) {
	switch ( action.type ) {
		case SET_OVERALL_READABILITY_SCORE:
			return setOverallReadabilityScore( state, action );
		case SET_OVERALL_SEO_SCORE:
			return setOverallSeoScore( state, action );
		default:
			return state;
	}
}
