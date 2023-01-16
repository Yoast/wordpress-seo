import { createSelector, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../constants";

export const REMOVE_NEW_TAXONOMY_NOTIFICATION = "removeNewTaxonomyNotification";

/**
 * @param {string} id The notification ID.
 * @returns {Object} Success or error action object.
 */
export function* removeNewTaxonomyNotification( id ) {
	yield{ type: `${ REMOVE_NEW_TAXONOMY_NOTIFICATION }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Trigger the control flow.
		yield{
			type: REMOVE_NEW_TAXONOMY_NOTIFICATION,
			payload: id,
		};
		return { type: `${ REMOVE_NEW_TAXONOMY_NOTIFICATION }/${ ASYNC_ACTION_NAMES.success }`, payload: id };
	} catch ( error ) {
		console.error( error );
		return { type: `${ REMOVE_NEW_TAXONOMY_NOTIFICATION }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

/**
 * @returns {Object} The initial state.
 */
export const createInitialNewTaxonomyNotificationsState = () => ( {
	ids: [ ...get( window, "wpseoScriptData.newTaxonomyNotifications", [] ) ],
	status: ASYNC_ACTION_STATUS.idle,
	error: "",
} );

const slice = createSlice( {
	name: "newTaxonomyNotifications",
	initialState: createInitialNewTaxonomyNotificationsState(),
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( `${ REMOVE_NEW_TAXONOMY_NOTIFICATION }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ REMOVE_NEW_TAXONOMY_NOTIFICATION }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.ids = state.ids.filter( id => id !== payload );
		} );
		builder.addCase( `${ REMOVE_NEW_TAXONOMY_NOTIFICATION }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = payload;
		} );
	},
} );

export const newTaxonomyNotificationsSelectors = {
	selectNewTaxonomyNotifications: state => get( state, "newTaxonomyNotifications.ids", [] ),
};
newTaxonomyNotificationsSelectors.selectHasNewTaxonomyNotification = createSelector(
	[
		newTaxonomyNotificationsSelectors.selectNewTaxonomyNotifications,
		( state, notificationId ) => notificationId,
	],
	( newTaxonomyNotifications, notificationId ) => newTaxonomyNotifications.includes( notificationId )
);

export const newTaxonomyNotificationsActions = {
	...slice.actions,
	removeNewTaxonomyNotification,
};

export const newTaxonomyNotificationsControls = {
	[ REMOVE_NEW_TAXONOMY_NOTIFICATION ]: async( { payload } ) => apiFetch( {
		path: "yoast/v1/settings_introduction/remove_notification",
		method: "POST",
		data: { id: payload },
	} ),
};

export default slice.reducer;
