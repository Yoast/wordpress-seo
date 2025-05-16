import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const AI_OPTIMIZE_NOTIFICATION_STATUS_NAME = "aiOptimizeNotificationStatus";

const slice = createSlice( {
	name: AI_OPTIMIZE_NOTIFICATION_STATUS_NAME,
	initialState: false,
	reducers: {
		setIsNotificationVisible: ( state, { payload } ) => payload,
	},
} );

export const getInitialNotificationStatusState = slice.getInitialState;

export const aiOptimizeNotificationStatusSelectors = {
	isNotificationVisible: state => get( state, AI_OPTIMIZE_NOTIFICATION_STATUS_NAME, "" ),
};

export const aiOptimizeNotificationStatusActions = slice.actions;

export const aiOptimizeNotificationStatusReducer = slice.reducer;
