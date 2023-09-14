import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../constants";

export const WISTIA_EMBED_PERMISSION_NAME = "wistiaEmbedPermission";

/**
 * @param {bool} value The value to set.
 * @returns {Object} Success or error action object.
 */
function* setWistiaEmbedPermission( value ) {
	yield{ type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		yield{ type: WISTIA_EMBED_PERMISSION_NAME, payload: value };
		return { type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: { value } };
	} catch ( error ) {
		// Note: we set the value anyway because the intention was there. Error-ing just means we will ask again next time.
		return { type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: { error, value } };
	}
}

const slice = createSlice( {
	name: WISTIA_EMBED_PERMISSION_NAME,
	initialState: {
		value: false,
		status: ASYNC_ACTION_STATUS.idle,
		error: {},
	},
	reducers: {
		setWistiaEmbedPermissionValue: ( state, { payload } ) => {
			state.value = Boolean( payload );
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.request }`, state => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.value = Boolean( payload && payload.value );
		} );
		builder.addCase( `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.value = Boolean( payload && payload.value );
			state.error = {
				code: get( payload, "error.code", 500 ),
				message: get( payload, "error.message", "Unknown" ),
			};
		} );
	},
} );

export const getInitialWistiaEmbedPermissionState = slice.getInitialState;

export const wistiaEmbedPermissionSelectors = {
	selectWistiaEmbedPermission: state => get( state, WISTIA_EMBED_PERMISSION_NAME, { value: false, status: ASYNC_ACTION_STATUS.idle } ),
	selectWistiaEmbedPermissionValue: state => get( state, [ WISTIA_EMBED_PERMISSION_NAME, "value" ], false ),
	selectWistiaEmbedPermissionStatus: state => get( state, [ WISTIA_EMBED_PERMISSION_NAME, "status" ], ASYNC_ACTION_STATUS.idle ),
	selectWistiaEmbedPermissionError: state => get( state, [ WISTIA_EMBED_PERMISSION_NAME, "error" ], {} ),
};

export const wistiaEmbedPermissionActions = {
	...slice.actions,
	setWistiaEmbedPermission,
};

export const wistiaEmbedPermissionControls = {
	[ WISTIA_EMBED_PERMISSION_NAME ]: async( { payload } ) => apiFetch( {
		path: "/yoast/v1/wistia_embed_permission",
		method: "POST",
		data: { value: Boolean( payload ) },
	} ),
};

export const wistiaEmbedPermissionReducer = slice.reducer;
