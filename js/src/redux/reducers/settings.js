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
	if ( action.type === SET_SETTINGS ) {
		return action.settings;
	}

	return state;
}
