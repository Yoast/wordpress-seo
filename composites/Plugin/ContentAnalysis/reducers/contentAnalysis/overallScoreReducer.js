import { SET_OVERALL_SCORE_READABILITY, SET_OVERALL_SCORE_SEO } from "../../actions/contentAnalysis";

/**
 * Initial state
 */
const initialState = {};

export function setOverallScoreReadability( state, action ) {
	return Object.assign( {}, state.analysis.readability,
		{ overallScore: action.overallScore }
	);
}

/**
 * Sets the overall score for SEO results for one or more keywords.
 *
 * @param {Object} action The action.
 * @returns {Object} The overall score per keyword.
 */
export function setOverallScoreSeo( state, action ) {
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
		case SET_OVERALL_SCORE_READABILITY:
			return setOverallScoreReadability( state, action );
		case SET_OVERALL_SCORE_SEO:
			return setOverallScoreSeo( state, action );
		default:
			return state;
	}
}
