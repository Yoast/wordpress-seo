import { createSlice, nanoid } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import apiFetch from "@wordpress/api-fetch";

/**
 * @returns {Object} The initial state.
 */

const NEW_CONTENT_ACTION_NAME = "removeNewContentNotification";

/**
 * @returns {Object} Success or error action object.
 */
export function* removeNewContentNotification() {
	try {
		yield{
			type: NEW_CONTENT_ACTION_NAME,
		};
	} catch ( error ) {
		// Empty.
	}
	return { type: "notifications/removeNotification", payload: "new-content-type" };
}

const slice = createSlice( {
	name: "notifications",
	initialState: {},
	reducers: {
		addNotification: {
			reducer: ( state, { payload } ) => {
				state[ payload.id ] = {
					id: payload.id,
					variant: payload.variant,
					size: payload.size,
					title: payload.title,
					description: payload.description,
				};
			},
			prepare: ( { id, variant = "info", size = "default", title, description } ) => ( {
				payload: {
					id: id || nanoid(),
					variant,
					size,
					title,
					description,
				},
			} ),
		},
		removeNotification: ( state, { payload } ) => omit( state, payload ),
	},
} );

export const getInitialNotificationsState = slice.getInitialState;

export const notificationsSelectors = {
	selectNotifications: ( state ) => get( state, "notifications", {} ),
	selectNotification: ( state, id ) => get( state, `notifications.${ id }`, null ),
};

export const removeNewContentNotificationControls = {
	[ NEW_CONTENT_ACTION_NAME ]: async() => apiFetch( {
		path: "/yoast/v1/needs-review/dismiss-notification",
		method: "POST",
	} ),
};

export const notificationsActions = {
	...slice.actions,
	removeNewContentNotification,
};

export default slice.reducer;
