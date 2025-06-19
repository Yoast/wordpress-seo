/* eslint-disable camelcase */
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

const redirectsAdapter = createEntityAdapter();
export const REDIRECTS_SETTINGS_NAME = "redirectsSettings";
export const FETCH_REDIRECTS_SETTINGS_ACTION = "fetchRedirectsSettings";
export const EDIT_REDIRECT_SETTINGS_ACTION_NAME = "editRedirectsSettings";

let abortController;

/**
 * Get redirects settings.
 *
 * @returns {Generator<Object, Object, *>} Redux generator action object.
 */
export function* fetchRedirectsSettings() {
	yield{ type: `${FETCH_REDIRECTS_SETTINGS_ACTION}/${ASYNC_ACTION_NAMES.request}` };

	try {
		const response = yield{
			type: FETCH_REDIRECTS_SETTINGS_ACTION,
		};

		yield{
			type: `${FETCH_REDIRECTS_SETTINGS_ACTION}/${ASYNC_ACTION_NAMES.success}`,
			payload: response,
		};
	} catch ( error ) {
		yield{
			type: `${FETCH_REDIRECTS_SETTINGS_ACTION}/${ASYNC_ACTION_NAMES.error}`,
			payload: error,
		};
	}
}

/**
 * Edit redirects settings
 *
 * @param {Object} values Values for update redirect.
 * @returns {Generator<Object, Object, *>} Redux generator action object.
 */
export function* editRedirectsSettingsAsync( values ) {
	yield{
		type: EDIT_REDIRECT_SETTINGS_ACTION_NAME,
		payload: values,
	};
	yield* fetchRedirectsSettings();

	return {
		type: `${EDIT_REDIRECT_SETTINGS_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`,
		payload: null,
	};
}

// Initial state
const initialState = {
	initialState: redirectsAdapter.getInitialState( {
		status: ASYNC_ACTION_STATUS.idle,
		error: "",
		settings: {
			is_apache: false,
			disable_php_redirect: "off",
			separate_file: "off",
		},
	} ),
};

const redirectsSettingsSlice = createSlice( {
	name: REDIRECTS_SETTINGS_NAME,
	initialState,
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( `${FETCH_REDIRECTS_SETTINGS_ACTION}/${ASYNC_ACTION_NAMES.request}`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${FETCH_REDIRECTS_SETTINGS_ACTION}/${ASYNC_ACTION_NAMES.success}`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.settings = action.payload;
		} );
		builder.addCase( `${FETCH_REDIRECTS_SETTINGS_ACTION}/${ASYNC_ACTION_NAMES.error}`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = action.payload;
		} );
	},
} );

export const getRedirectsSettingsInitialState = redirectsSettingsSlice.getInitialState;

// Selectors
export const redirectsSettingsSelectors = {
	selectSettings: ( state ) => state[ REDIRECTS_SETTINGS_NAME ].settings,
	selectSettingsStatus: ( state ) => state[ REDIRECTS_SETTINGS_NAME ].status,
	selectSettingsError: ( state ) => state[ REDIRECTS_SETTINGS_NAME ].error,
};

// Controls
export const redirectsSettingsControls = {
	[ FETCH_REDIRECTS_SETTINGS_ACTION ]: async() => {
		abortController?.abort();
		abortController = new AbortController();
		const response = await apiFetch( {
			path: "/yoast/v1/redirects/settings",
			signal: abortController.signal,
		} );
		return response;
	},
	[ EDIT_REDIRECT_SETTINGS_ACTION_NAME ]: async( { payload } ) => {
		return apiFetch( {
			path: "/yoast/v1/redirects/settings",
			method: "PUT",
			data: payload,
		} );
	},
};

// Actions
export const redirectsSettingsActions = {
	...redirectsSettingsSlice.actions,
	fetchRedirectsSettings,
	editRedirectsSettingsAsync,
};

export default redirectsSettingsSlice.reducer;
