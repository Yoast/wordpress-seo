import { SET_ACTIVE_TAB } from "../actions/activeTab";

const INITIAL_STATE = null;

/**
 * A reducer for the active tab.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function activeTabReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case SET_ACTIVE_TAB:
			return action.tab;
		default:
			return state;
	}
}

export default activeTabReducer;
