import { SET_ACTIVE_KEYWORD } from "../actions/activeKeyword";

const INITIAL_STATE = null;

/**
 * A reducer for the active keyword.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function activeKeywordReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case SET_ACTIVE_KEYWORD:
			return action.keyword;
		default:
			return state;
	}
}

export default activeKeywordReducer;
