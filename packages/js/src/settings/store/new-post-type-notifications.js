import { createSelector, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../constants";

export const REMOVE_NEW_POST_TYPE_NOTIFICATION = "removeNewPostTypeNotification";

/**
 * @param {string} id The notification ID.
 * @returns {Object} Success or error action object.
 */
export function* removeNewPostTypeNotification( id ) {
	yield{ type: `${ REMOVE_NEW_POST_TYPE_NOTIFICATION }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Trigger the control flow.
		yield{
			type: REMOVE_NEW_POST_TYPE_NOTIFICATION,
			payload: id,
		};
		return { type: `${ REMOVE_NEW_POST_TYPE_NOTIFICATION }/${ ASYNC_ACTION_NAMES.success }`, payload: id };
	} catch ( error ) {
		console.error( error );
		return { type: `${ REMOVE_NEW_POST_TYPE_NOTIFICATION }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

/**
 * @returns {Object} The initial state.
 */
export const createInitialNewPostTypeNotificationsState = () => ( {
	ids: [ ...get( window, "wpseoScriptData.newPostTypeNotifications", [] ) ],
	status: ASYNC_ACTION_STATUS.idle,
	error: "",
} );

const slice = createSlice( {
	name: "newPostTypeNotifications",
	initialState: createInitialNewPostTypeNotificationsState(),
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( `${ REMOVE_NEW_POST_TYPE_NOTIFICATION }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ REMOVE_NEW_POST_TYPE_NOTIFICATION }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.ids = state.ids.filter( id => id !== payload );
		} );
		builder.addCase( `${ REMOVE_NEW_POST_TYPE_NOTIFICATION }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = payload;
		} );
	},
} );

export const newPostTypeNotificationsSelectors = {
	selectNewPostTypeNotifications: state => get( state, "newPostTypeNotifications.ids", [] ),
};
newPostTypeNotificationsSelectors.selectHasNewPostTypeNotification = createSelector(
	[
		newPostTypeNotificationsSelectors.selectNewPostTypeNotifications,
		( state, notificationId ) => notificationId,
	],
	( newPostTypeNotifications, notificationId ) => newPostTypeNotifications.includes( notificationId )
);

export const newPostTypeNotificationsActions = {
	...slice.actions,
	removeNewPostTypeNotification,
};

export const newPostTypeNotificationsControls = {
	[ REMOVE_NEW_POST_TYPE_NOTIFICATION ]: async( { payload } ) => apiFetch( {
		path: "yoast/v1/settings_introduction/remove_notification",
		method: "POST",
		data: { id: payload },
	} ),
};

export default slice.reducer;
