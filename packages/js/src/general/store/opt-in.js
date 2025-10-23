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
		return { type: `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.success }`, payload: key };
	} catch ( error ) {
		return { type: `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.error }`, payload: key };
	}
}

const slice = createSlice( {
	name: OPT_IN_NOTIFICATION_NAME,
	initialState: { seen: {} },
	extraReducers: ( builder ) => {
		builder.addCase( `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.seen[ payload ] = true;
		} );
		builder.addCase( `${ OPT_IN_NOTIFICATION_SEEN }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			// Even on error, we mark the notification as seen to avoid showing it again.
			state.seen[ payload ] = true;
		} );
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialOptInNotificationState = slice.getInitialState;


export const optInNotificationSelectors = {
	selectIsOptInNotificationSeen: ( state, key ) => get( state, [ OPT_IN_NOTIFICATION_NAME, "seen", key ], false ),
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
