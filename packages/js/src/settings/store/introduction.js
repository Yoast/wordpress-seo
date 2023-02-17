import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get, includes, values } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS, INTRODUCTION_VIDEO_FLOW } from "../constants";

export const SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME = "setIntroductionWistiaEmbedPermission";
export const SET_INTRODUCTION_SHOW_ACTION_NAME = "setIntroductionShow";

/**
 * @param {bool} value The value to set.
 * @returns {Object} Success or error action object.
 */
export function* setIntroductionWistiaEmbedPermission( value ) {
	yield{ type: `${ SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		yield{
			type: SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME,
			payload: value,
		};
		return { type: `${ SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: { value } };
	} catch ( error ) {
		// Note: we set the value anyway because the intention was there. Error-ing just means we will ask again next time.
		return { type: `${ SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: { error, value } };
	}
}

/**
 * @param {bool} value The value to set.
 * @returns {Object} Success or error action object.
 */
export function* setIntroductionShow( value ) {
	yield{ type: `${ SET_INTRODUCTION_SHOW_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		yield{
			type: SET_INTRODUCTION_SHOW_ACTION_NAME,
			payload: value,
		};
		return { type: `${ SET_INTRODUCTION_SHOW_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: { value } };
	} catch ( error ) {
		// Note: we set the value anyway because the intention was there. Error-ing just means we will ask again next time.
		return { type: `${ SET_INTRODUCTION_SHOW_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: { error, value } };
	}
}

/**
 * @returns {Object} The initial state.
 */
export const createInitialIntroductionState = () => ( {
	videoFlow: INTRODUCTION_VIDEO_FLOW.showPlay,
	wistiaEmbedPermission: {
		value: get( window, "wpseoScriptData.introduction.wistiaEmbedPermission", false ),
		status: ASYNC_ACTION_STATUS.idle,
		error: {},
	},
	show: {
		value: get( window, "wpseoScriptData.introduction.show", true ),
		status: ASYNC_ACTION_STATUS.idle,
		error: {},
	},
} );

const slice = createSlice( {
	name: "introduction",
	initialState: createInitialIntroductionState(),
	reducers: {
		/**
		 * @param {Object} state The state.
		 * @param {Object} payload The payload.
		 * @returns {void}
		 */
		setIntroductionVideoFlow( state, { payload } ) {
			if ( ! includes( values( INTRODUCTION_VIDEO_FLOW ), payload ) ) {
				console.error( "Invalid video flow state:", payload );
				return;
			}
			state.videoFlow = payload;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, state => {
			state.wistiaEmbedPermission.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.wistiaEmbedPermission.status = ASYNC_ACTION_STATUS.success;
			state.wistiaEmbedPermission.value = payload.value;
		} );
		builder.addCase( `${ SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			console.error( `${ payload.error.code }: ${ payload.error.message }` );
			state.wistiaEmbedPermission.status = ASYNC_ACTION_STATUS.error;
			state.wistiaEmbedPermission.value = payload.value;
			state.wistiaEmbedPermission.error = payload.error;
		} );

		builder.addCase( `${ SET_INTRODUCTION_SHOW_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, state => {
			state.show.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ SET_INTRODUCTION_SHOW_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.show.status = ASYNC_ACTION_STATUS.success;
			state.show.value = payload.value;
		} );
		builder.addCase( `${ SET_INTRODUCTION_SHOW_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			console.error( `${ payload.error.code }: ${ payload.error.message }` );
			state.show.status = ASYNC_ACTION_STATUS.error;
			state.show.value = payload.value;
			state.show.error = payload.error;
		} );
	},
} );

export const introductionSelectors = {
	selectIntroductionVideoFlow: state => get( state, "introduction.videoFlow", INTRODUCTION_VIDEO_FLOW.showPlay ),
	selectIntroductionWistiaEmbedPermission: state => get( state, "introduction.wistiaEmbedPermission", {
		value: false,
		status: ASYNC_ACTION_STATUS.idle,
		error: {},
	} ),
	selectIntroductionShowValue: state => get( state, "introduction.show.value", true ),
};

export const introductionActions = {
	...slice.actions,
	setIntroductionWistiaEmbedPermission,
	setIntroductionShow,
};

export const introductionControls = {
	[ SET_INTRODUCTION_WISTIA_EMBED_PERMISSION_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		path: "/yoast/v1/settings_introduction/wistia_embed_permission",
		method: "POST",
		data: { value: payload },
	} ),
	[ SET_INTRODUCTION_SHOW_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		path: "/yoast/v1/settings_introduction/show",
		method: "POST",
		data: { value: payload },
	} ),
};

export default slice.reducer;
