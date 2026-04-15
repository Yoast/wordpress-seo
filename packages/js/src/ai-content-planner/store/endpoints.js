import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const ENDPOINTS_NAME = "endpoints";

const slice = createSlice( {
	name: ENDPOINTS_NAME,
	initialState: {
		contentPlanner: "",
	},
	reducers: {},
} );

export const getInitialEndpointsState = slice.getInitialState;

export const endpointsSelectors = {
	selectContentPlannerEndpoint: ( state ) =>
		get( state, [ ENDPOINTS_NAME, "contentPlanner" ], slice.getInitialState().contentPlanner ),
};

export const endpointsActions = {
	...slice.actions,
};

export const endpointsReducer = slice.reducer;
