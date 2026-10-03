import { findIndex, isUndefined } from "lodash";
import {
	SET_INCLUSIVE_LANGUAGE_RESULTS,
	SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE,
	UPDATE_INCLUSIVE_LANGUAGE_RESULT,
} from "../../actions/contentAnalysis";

/**
 * Initial state
 */
const initialState = {
	results: [],
	overallScore: null,
};

/**
 * Helper functions
 */

/**
 * Sets the inclusive language results.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new results.
 */
function setInclusiveLanguageResults( state, action ) {
	return Object.assign( {}, state,
		{ results: action.results }
	);
}

/**
 * Updates an inclusive language result.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new results.
 */
function updateInclusiveLanguageResult( state, action ) {
	// Sets a new inclusive language result if there currently are no results.
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
 * Sets the overall score for the inclusive language analysis.
 *
 * @param {Object} state  The state
 * @param {Object} action The action
 * @returns {Object} The overall score for the inclusive language analysis
 */
export function setOverallInclusiveLanguageScore( state, action ) {
	return Object.assign( {}, state,
		{ overallScore: action.overallScore }
	);
}

/**
 * Reducers
 */

/**
 * A reducer for the inclusive language object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 * @returns {Object} The updated inclusive language results object.
 */
export function inclusiveLanguageResultsReducer( state = initialState, action ) {
	switch ( action.type ) {
		case SET_INCLUSIVE_LANGUAGE_RESULTS:
			return setInclusiveLanguageResults( state, action );
		case UPDATE_INCLUSIVE_LANGUAGE_RESULT:
			return updateInclusiveLanguageResult( state, action );
		case SET_OVERALL_INCLUSIVE_LANGUAGE_SCORE:
			return setOverallInclusiveLanguageScore( state, action );
		default:
			return state;
	}
}
