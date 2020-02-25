import { SET_SETTINGS } from "../actions/settings";

/**
 * A reducer for settings.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
export default function settingsReducer( state = {}, action ) {
	switch ( action.type ) {
		case SET_SETTINGS:
			return { ...state, ...action.settings };
		default:
			return state;
	}
}
