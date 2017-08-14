import { UPDATE_SEO_RESULT } from "../../actions/contentAnalysis";

/**
 * Initial state
 */
const initialState = {};

/**
 * Reducers
 */

/**
 * A reducer for the keyword results object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 * @returns {Object} The updated keywords results object.
 */
export function keywordResultsReducer( state = initialState, action ) {
	switch ( action.type ) {
		case UPDATE_SEO_RESULT:
			if( ! state[ action.keyword ] ) {
				return Object.assign( {}, state, {
					[ action.keyword ]: [ action.result ],
				} );
			}
			return Object.assign( {}, state, {
				[ action.keyword ]: [ ...state[ action.keyword ], action.result ],
			} );
		default:
			return state;
	}
}
