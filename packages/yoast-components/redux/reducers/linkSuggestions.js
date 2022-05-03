import { SET_LINK_SUGGESTIONS } from "../actions/linkSuggestions";

const INITIAL_STATE = [];

/**
 * A reducer for the link suggestions object.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated link suggestions object.
 */
function linkSuggestionsReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_LINK_SUGGESTIONS:
			return action.linkSuggestions;
		default:
			return state;
	}
}

export default linkSuggestionsReducer;
