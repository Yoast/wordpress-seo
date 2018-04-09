import { SET_OVERALL_READABILITY_SCORE, SET_OVERALL_SEO_SCORE } from "../../actions/contentAnalysis";

/**
 * Initial state
 */
const initialState = {};

export function setOverallReadabilityScore( state, action ) {
	return Object.assign( {}, state.analysis.readability,
		{ overallScore: action.overallScore }
	);
}

/**
 * Sets the overall score for SEO results for one or more keywords.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 * @returns {Object} The overall score per keyword.
 */
export function setOverallSeoScore( state, action ) {
	let scorePerKeyword = {};
	action.scorePerKeyword.forEach( function( keywordResultsPair ) {
		scorePerKeyword[ keywordResultsPair.keyword ].overallScore = keywordResultsPair.overallScore;
	} );
	return Object.assign( {}, state.analysis.seo, {
		[ action.keyword ]: scorePerKeyword,
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
