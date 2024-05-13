import { SET_ACTIVE_AI_FIXES_BUTTON } from "../actions/activeAIButton";

const INITIAL_STATE = null;

/**
 * A reducer for the active AI fixes button.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
function activeAIButton( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_ACTIVE_AI_FIXES_BUTTON:
			// Create a toggle effect so that the AI fixes button can be turned off.
			return action.activeAIButton;
		default:
			return state;
	}
}

export default activeAIButton;
