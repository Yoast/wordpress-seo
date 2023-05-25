import { createSlice, nanoid } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";

/**
 * @returns {Object} The initial state.
 */
export const createInitialNotificationsState = () => {
	const isNewContentType = get( window, "wpseoScriptData.isNewContentType", false );
	if ( isNewContentType ) {
		return { newContentType: {
			id: "new-content-type",
			variant: "info",
			size: "large",
			title: __( "New type of content added to your site! Please see the “Review” badges and review the Search appearance settings", "wordpress-seo" ),
		 } };
	}
	return {};
};

const NEW_CONTENT_ACTION_NAME = "updateReviewStatus";

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
	return { type: `${ NEW_CONTENT_ACTION_NAME }/result` };
}

const slice = createSlice( {
	name: "notifications",
	initialState: createInitialNotificationsState(),
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
	extraReducers: ( builder ) => {
		builder.addCase( `${ NEW_CONTENT_ACTION_NAME }/result`, ( state ) => {
			delete state.newContentType;
		} );
	},
} );

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
