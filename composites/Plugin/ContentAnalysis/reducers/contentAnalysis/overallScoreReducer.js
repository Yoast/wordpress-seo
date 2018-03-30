import { SET_OVERALL_SCORE_READABILITY, SET_OVERALL_SCORE_SEO } from "../../actions/contentAnalysis";

/**
 * Initial state
 */
const initialState = {};

/**
 * Sets the overall score for SEO results for one or more keywords.
 *
 * @param {Object} action The action.
 * @returns {Object} The overall score per keyword.
 */
function setOverallScoreSeo( action ) {
	let scorePerKeyword = {};
	action.scorePerKeyword.forEach( function( keywordResultsPair ) {
		scorePerKeyword[ keywordResultsPair.keyword ] = keywordResultsPair.overallScore;
	} );
	return scorePerKeyword;
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
			return action.overallScore;
		case SET_OVERALL_SCORE_SEO:
			return setOverallScoreSeo( action );
		default:
			return state;
	}
}
