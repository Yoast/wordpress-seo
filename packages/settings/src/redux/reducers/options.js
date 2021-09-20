import { mergePathToState } from "@yoast/admin-ui-toolkit/helpers";
import { APPLY_THEME_MODIFICATIONS_SUCCESS, REMOVE_THEME_MODIFICATIONS_SUCCESS, SET_ALL_OPTIONS, SET_OPTION } from "../constants.js";

/**
 * A reducer for the options in the state.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function optionsReducer( state, { type, payload } ) {
	switch ( type ) {
		case SET_OPTION:
			return mergePathToState( state, payload.path, payload.value );
		case SET_ALL_OPTIONS:
			return { ...state, ...payload };

		case APPLY_THEME_MODIFICATIONS_SUCCESS:
			return mergePathToState( state, "dashboard.themeModificationsActive", true );
		case REMOVE_THEME_MODIFICATIONS_SUCCESS:
			return mergePathToState( state, "dashboard.themeModificationsActive", false );

		default:
			return state;
	}
}
