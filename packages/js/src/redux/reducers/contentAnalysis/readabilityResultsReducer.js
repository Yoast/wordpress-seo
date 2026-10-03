import { UPDATE_READABILITY_RESULT, SET_READABILITY_RESULTS, SET_OVERALL_READABILITY_SCORE } from "../../actions/contentAnalysis";
import { findIndex, isUndefined } from "lodash";

/**
 * Initial state
 */
const initialState = {};

/**
 * Helper functions
 */

/**
 * Sets the readability results.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new results.
 */
function setReadabilityResults( state, action ) {
	return Object.assign( {}, state,
		{ results: action.results }
	);
}

/**
 * Updates a readability result.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new results.
 */
function updateReadabilityResult( state, action ) {
	// Sets a new readability result if there currently are no results.
	if ( isUndefined( state.results ) ) {
		return Object.assign( {}, state,
			{ results: [ action.result ] }
		);
	}
	const resultIndex = findIndex( state.results, { id: action.result.id } );
	// Replace a result when there already is a result with the given id.
	if ( resultIndex !== -1 ) {
		const newResults = state.results.filter( function( result ) {
			return result !== state.results[ resultIndex ];
		} );
		return Object.assign( {}, state,
			{ results: newResults.concat( action.result ) }
		);
	}
	return Object.assign( {}, state,
		{ results: [ ...state.results, action.result ] }
	);
}

/**
 * Sets the overall score for the readability analysis.
 *
 * @param {Object} state  The state
 * @param {Object} action The action
 * @returns {Object} The overall score for the readability analysis
 */
export function setOverallReadabilityScore( state, action ) {
	return Object.assign( {}, state,
		{ overallScore: action.overallScore }
	);
}

/**
 * Reducers
 */

/**
 * A reducer for the readability object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 * @returns {Object} The updated readability results object.
 */
export function readabilityResultsReducer( state = initialState, action ) {
	switch ( action.type ) {
		case SET_READABILITY_RESULTS:
			return setReadabilityResults( state, action );
		case UPDATE_READABILITY_RESULT:
			return updateReadabilityResult( state, action );
		case SET_OVERALL_READABILITY_SCORE:
			return setOverallReadabilityScore( state, action );
		default:
			return state;
	}
}
