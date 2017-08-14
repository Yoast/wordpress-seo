import { UPDATE_SEO_RESULT } from "../../actions/contentAnalysis";

/**
 * Initial state
 */
const initialState = {};

/**
 * Reducers
 */

/**
 * A reducer for the seo object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 * @returns {Object} The updated seo object.
 */
export function seoReducer( state = initialState.seo, action ) {
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
