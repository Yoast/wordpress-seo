import { SET_ACTIVE_AI_FIXES_BUTTON, SET_DISABLED_AI_FIXES_BUTTONS } from "../actions";

const INITIAL_STATE = {
	activeAIButton: null,
	disabledAIButtons: {},
};

/**
 * A reducer for the AI fixes buttons.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
export default function AIButton( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_ACTIVE_AI_FIXES_BUTTON:
			return {
				...state,
				activeAIButton: action.activeAIButton,
			};
		case SET_DISABLED_AI_FIXES_BUTTONS:
			return {
				...state,
				disabledAIButtons: action.disabledAIButtons,
			};
		default:
			return state;
	}
}
