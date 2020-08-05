import { SET_POST_SETTINGS_MODAL_IS_OPEN } from "../actions";

const INITIAL_STATE = {
	isOpen: false,
};

/**
 * A reducer for the post settings modal.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
export default function postSettingsModalReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_POST_SETTINGS_MODAL_IS_OPEN:
			return {
				...state,
				isOpen: action.isOpen,
			};
		default:
			return state;
	}
}
