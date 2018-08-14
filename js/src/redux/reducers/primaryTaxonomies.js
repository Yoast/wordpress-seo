import { SET_PRIMARY_TAXONOMY } from "../actions/primaryTaxonomies";

const INITIAL_STATE = {};

/**
 * A reducer for the focus keyword.
 *
 * @param {string} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {string} The state.
 */
function focusKeywordReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case SET_PRIMARY_TAXONOMY:
			return {
				...state,
				[ action.taxonomy ]: action.termId,
			};
		default:
			return state;
	}
}

export default focusKeywordReducer;
