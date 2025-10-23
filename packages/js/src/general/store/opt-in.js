import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES } from "../../shared-admin/constants";
import apiFetch from "@wordpress/api-fetch";

export const OPT_IN_NOTIFICATION_NAME = "optInNotification";

const OPT_IN_NOTIFICATION_SEEN = "setOptInNotificationSeen";

/**
 * @param {string} key The key of the notification to set as seen.
 * @returns {Object} Success or error action object.
 */
function* setOptInNotificationSeen( key ) {
	yield{ type: `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		yield{
			type: OPT_IN_NOTIFICATION_SEEN,
			payload: key,
		};
		return { type: `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.success }` };
	} catch ( error ) {
		return { type: `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.error }` };
	}
}

const slice = createSlice( {
	name: OPT_IN_NOTIFICATION_NAME,
	initialState: { seen: false },
	extraReducers: ( builder ) => {
		builder.addCase( `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.success }`, ( state ) => {
			state.seen = true;
		} );
		builder.addCase( `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.error }`, ( state ) => {
			state.seen = false;
		} );
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialOptInNotificationState = slice.getInitialState;


export const optInNotificationSelectors = {
	selectIsOptInNotificationSeen: ( state ) => get( state, `${ OPT_IN_NOTIFICATION_NAME }.seen`, false ),
};

export const optInNotificationActions = {
	...slice.actions,
	setOptInNotificationSeen,
};

export const optInNotificationControls = {
	[ OPT_IN_NOTIFICATION_SEEN ]: async( { payload } ) => {
		await apiFetch( {
			path: "yoast/v1/seen-opt-in-notification",
			method: "POST",
			data: { key: payload },
		} );
	},
};

export const optInNotificationReducer = slice.reducer;
