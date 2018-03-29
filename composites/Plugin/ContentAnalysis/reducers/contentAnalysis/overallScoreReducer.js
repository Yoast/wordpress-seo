import { SET_OVERALL_SCORE, UPDATE_OVERALL_SCORE } from "../../actions/contentAnalysis";
import findIndex from "lodash/findIndex";

/**
 * Updates the overall score.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The updated overall score.
 */
function updateOverallScore( state, action ) {
	let scoreIndex = findIndex( state, { id: action.score.id } );

	// Replace a score when there already is a score with the given id.
	if( scoreIndex !== -1 ) {
		let newScore = state.filter( function( result ) {
			return result !== state[ scoreIndex ];
		} );
		return newScore.concat( action.score );
	}
	return state.concat( action.score );
}


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
			return action.score;
		case UPDATE_OVERALL_SCORE:
			return updateOverallScore( state, action );
	}
}