import { createSlice, nanoid } from "@reduxjs/toolkit";
import { get, omit } from "lodash";

export const NOTIFICATIONS_NAME = "notifications";

const slice = createSlice( {
	name: NOTIFICATIONS_NAME,
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
					title: title || "",
					description,
				},
			} ),
		},
		removeNotification: ( state, { payload } ) => omit( state, payload ),
	},
} );

export const getInitialNotificationsState = slice.getInitialState;

export const notificationsSelectors = {
	selectNotifications: ( state ) => get( state, NOTIFICATIONS_NAME, {} ),
	selectNotification: ( state, id ) => get( state, [ NOTIFICATIONS_NAME, id ], null ),
};

export const notificationsActions = slice.actions;

export const notificationsReducer = slice.reducer;
