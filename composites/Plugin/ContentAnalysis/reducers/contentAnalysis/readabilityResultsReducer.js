import { UPDATE_READABILITY_RESULT } from "../../actions/contentAnalysis";

/**
 * Initial state
 */
const initialState = {
	readability: [],
};

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
		case UPDATE_READABILITY_RESULT:
			if ( state.readability.length === 0 ) {
				return Object.assign( {}, state, {
					readability: [ action.result ],
				} );
			}
			return Object.assign( {}, state, {
				readability: [ ...state.readability, action.result ],
			} );
		default:
			return state;
	}
}
