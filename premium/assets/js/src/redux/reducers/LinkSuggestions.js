import {
	LOAD_LINK_SUGGESTIONS,
	SET_LINK_SUGGESTIONS,
	SET_LINK_SUGGESTIONS_ERROR,
} from "../actions/LinkSuggestions";

const INITIAL_STATE = {
	suggestions: [],
	isLoading: false,
	showUnindexedWarning: false,
};

/* eslint-disable complexity */
/**
 * A reducer for the link suggestions.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function linkSuggestionsReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case LOAD_LINK_SUGGESTIONS:
					return Object.assign( {}, state, {
						isLoading: true,
					} );
		case LOAD_LINK_SUGGESTIONS:
					return Object.assign( {}, state, {
						suggestions: action.linkSuggestions,
						showUnindexedWarning: action.showUnindexedWarning,
					} );
		default:
			return state;
	}
}

export default linkSuggestionsReducer;
