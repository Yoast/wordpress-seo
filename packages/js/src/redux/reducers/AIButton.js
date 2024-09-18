import { SET_ACTIVE_AI_FIXES_BUTTON, SET_DISABLED_AI_FIXES_BUTTONS, SET_FOCUS_AI_FIXES_BUTTON } from "../actions";

const INITIAL_STATE = {
	activeAIButton: null,
	focusAIButton: null,
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
		case SET_ACTIVE_AI_FIXES_BUTTON: {
			const focusAIButton = action.activeAIButton === null && state.activeAIButton !== null ? state.activeAIButton : state.focusAIButton;
			console.log( "focusAIButton", focusAIButton );
			return {
				...state,
				activeAIButton: action.activeAIButton,
				focusAIButton,
			};
		}
		case SET_FOCUS_AI_FIXES_BUTTON:
			return {
				...state,
				focusAIButton: action.focusAIButton,
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
