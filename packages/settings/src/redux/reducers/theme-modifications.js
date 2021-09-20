import { combineReducers } from "@wordpress/data";
import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import {
	APPLY_THEME_MODIFICATIONS_ERROR,
	APPLY_THEME_MODIFICATIONS_REQUEST,
	APPLY_THEME_MODIFICATIONS_SUCCESS,
	REMOVE_THEME_MODIFICATIONS_ERROR,
	REMOVE_THEME_MODIFICATIONS_REQUEST,
	REMOVE_THEME_MODIFICATIONS_SUCCESS,
} from "../constants.js";

/**
 * Reducer for the apply theme modifications async status and result.
 * @param {string} state The current state.
 * @param {Action} action The action object.
 * @returns {string} The new state.
 */
const applyThemeModifications = ( state, { type } ) => {
	switch ( type ) {
		case APPLY_THEME_MODIFICATIONS_REQUEST:
			return ASYNC_STATUS.loading;
		case APPLY_THEME_MODIFICATIONS_SUCCESS:
			return ASYNC_STATUS.success;
		case APPLY_THEME_MODIFICATIONS_ERROR:
			return ASYNC_STATUS.error;
		default:
			return state;
	}
};

/**
 * Reducer for the remove theme modifications async status and result.
 * @param {string} state The current state.
 * @param {Action} action The action object.
 * @returns {string} The new state.
 */
const removeThemeModifications = ( state, { type } ) => {
	switch ( type ) {
		case REMOVE_THEME_MODIFICATIONS_REQUEST:
			return ASYNC_STATUS.loading;
		case REMOVE_THEME_MODIFICATIONS_SUCCESS:
			return ASYNC_STATUS.success;
		case REMOVE_THEME_MODIFICATIONS_ERROR:
			return ASYNC_STATUS.error;
		default:
			return state;
	}
};

const themeModifications = combineReducers( {
	apply: applyThemeModifications,
	remove: removeThemeModifications,
} );

export default themeModifications;
