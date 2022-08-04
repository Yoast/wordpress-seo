import { createSlice, nanoid } from "@reduxjs/toolkit";
import { get, omit } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialNotificationsState = () => ( {} );

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
			prepare: ( { variant = "info", size = "default", title, description } ) => ( {
				payload: {
					id: nanoid(),
					variant,
					size,
					title,
					description,
				},
			} ),
		},
		removeNotification: ( state, { payload } ) => omit( state, payload?.id ),
	},
} );

export const notificationsSelectors = {
	selectNotifications: ( state ) => get( state, "notifications", {} ),
	selectNotification: ( state, id ) => get( state, `notifications.${ id }`, {} ),
};

export const notificationsActions = slice.actions;

export default slice.reducer;
