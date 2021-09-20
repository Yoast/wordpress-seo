import { select } from "@wordpress/data";
import { merge } from "lodash";

import { REDUX_STORE_KEY } from "../constants";
import { customDataCallbacks } from "../initializers/global-app";
import {
	ADD_NOTIFICATION,
	APPLY_THEME_MODIFICATIONS,
	APPLY_THEME_MODIFICATIONS_ERROR,
	APPLY_THEME_MODIFICATIONS_REQUEST,
	APPLY_THEME_MODIFICATIONS_SUCCESS,
	HANDLE_ROUTE_CHANGED,
	HANDLE_ROUTE_CHANGED_ERROR,
	HANDLE_ROUTE_CHANGED_REQUEST,
	HANDLE_ROUTE_CHANGED_SUCCESS,
	HANDLE_SAVE,
	HANDLE_SAVE_ERROR,
	HANDLE_SAVE_REQUEST,
	HANDLE_SAVE_SUCCESS,
	REMOVE_NOTIFICATION,
	REMOVE_THEME_MODIFICATIONS,
	REMOVE_THEME_MODIFICATIONS_ERROR,
	REMOVE_THEME_MODIFICATIONS_REQUEST,
	REMOVE_THEME_MODIFICATIONS_SUCCESS,
	REPLACE_ARRAY_DATA,
	SET_ALL_DATA,
	SET_DATA,
	TOGGLE_DATA,
} from "./constants";

/**
 * An action creator for the ADD_NOTIFICATION action.
 *
 * @param {Object} notification The data to set.
 *
 * @returns {Object} The ADD_NOTIFICATION action.
 */
export function addNotification( notification ) {
	return {
		type: ADD_NOTIFICATION,
		payload: notification,
	};
}

/**
 * An action creator for the REMOVE_NOTIFICATION action.
 *
 * @param {number} id The id of the notification to remove.
 *
 * @returns {Object} The REMOVE_NOTIFICATION action.
 */
export function removeNotification( id ) {
	return {
		type: REMOVE_NOTIFICATION,
		payload: id,
	};
}

/**
 * An action creator for the SET_ALL_DATA action.
 *
 * @param {Object} value The data to set.
 *
 * @returns {Object} The SET_ALL_DATA action.
 */
export function setAllData( value ) {
	return {
		type: SET_ALL_DATA,
		payload: value,
	};
}

/**
 * An action creator for the TOGGLE_DATA action.
 *
 * @param {Object} path The path to the data to toggle.
 *
 * @returns {Object} The TOGGLE_DATA action.
 */
export function toggleData( path ) {
	return {
		type: TOGGLE_DATA,
		payload: { path },
	};
}

/**
 * An action creator for the SET_DATA action.
 *
 * @param {String} path The path to the data in the store.
 * @param {*} value The value to set.
 *
 * @returns {Object} The SET_DATA action.
 */
export function setData( path, value ) {
	return {
		type: SET_DATA,
		payload: { path, value },
	};
}

/**
 * An action creator for the SET_ARRAY_DATA action.
 * This action
 *
 * @param {String} path The path to the data in the store.
 * @param {*} value The value to set.
 *
 * @returns {Object} The SET_ARRAY_DATA action.
 */
export function replaceArrayData( path, value ) {
	return {
		type: REPLACE_ARRAY_DATA,
		payload: { path, value },
	};
}

/**
 * An action creator for the HANDLE_SAVE_REQUEST action.
 *
 * @returns {Object} Either the HANDLE_SAVE_SUCCESS or the HANDLE_SAVE_ERROR action,
 *                   depending on the outcome of the save.
 */
export function* handleSave() {
	yield { type: HANDLE_SAVE_REQUEST };
	try {
		const formData = yield select( REDUX_STORE_KEY ).getAllData();
		const customData = customDataCallbacks.reduce( ( customCallbackData, cb ) => merge( customCallbackData, cb() ), {} );
		const data = merge( customData, formData );

		const response = yield { type: HANDLE_SAVE, payload: data };
		if ( response.status === 200 ) {
			return { type: HANDLE_SAVE_SUCCESS, payload: { data, response } };
		}
		return { type: HANDLE_SAVE_ERROR, payload: response };
	} catch ( error ) {
		return { type: HANDLE_SAVE_ERROR, payload: error };
	}
}

/**
 * Creates the action to notify that the route has changed.
 *
 * @param {Object} location The new location.
 *
 * @returns {{type: string}} The action.
 */
export function* handleRouteChanged( location ) {
	yield { type: HANDLE_ROUTE_CHANGED_REQUEST };

	try {
		yield { type: HANDLE_ROUTE_CHANGED, payload: location };

		return { type: HANDLE_ROUTE_CHANGED_SUCCESS, payload: { location } };
	} catch ( error ) {
		return { type: HANDLE_ROUTE_CHANGED_ERROR, payload: { location, error } };
	}
}

/**
 * Creates the action to apply the theme modifications.
 *
 * @returns {Object} The action.
 */
export function* applyThemeModifications() {
	yield { type: APPLY_THEME_MODIFICATIONS_REQUEST };

	try {
		const response = yield { type: APPLY_THEME_MODIFICATIONS };

		if ( response?.status === 200 ) {
			return { type: APPLY_THEME_MODIFICATIONS_SUCCESS };
		}
		return { type: APPLY_THEME_MODIFICATIONS_ERROR, payload: response?.error?.message };
	} catch ( error ) {
		return { type: APPLY_THEME_MODIFICATIONS_ERROR };
	}
}

/**
 * Creates the action to remove the theme modifications.
 *
 * @returns {Object} The action.
 */
export function* removeThemeModifications() {
	yield { type: REMOVE_THEME_MODIFICATIONS_REQUEST };

	try {
		const response = yield { type: REMOVE_THEME_MODIFICATIONS };

		if ( response?.status === 200 ) {
			return { type: REMOVE_THEME_MODIFICATIONS_SUCCESS };
		}
		return { type: REMOVE_THEME_MODIFICATIONS_ERROR, payload: response?.error?.message };
	} catch ( error ) {
		return { type: REMOVE_THEME_MODIFICATIONS_ERROR };
	}
}
