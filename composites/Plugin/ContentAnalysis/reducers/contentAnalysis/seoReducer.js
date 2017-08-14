import { UPDATE_SEO_RESULT } from "../../actions/contentAnalysis";
import _union from "lodash/union";

/**
 * Initial state
 */
const initialState = {
	seo: {
		byKeyword: {},
	},
};

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
export function SEOReducer( state = initialState.seo, action ) {
	switch ( action.type ) {
		case UPDATE_SEO_RESULT:
			return Object.assign( {}, state, {
				byKeyword: { keyword: action.keyword, results: { results: [ action.result ] } },
			} );
		default:
			return state;
	}
}
