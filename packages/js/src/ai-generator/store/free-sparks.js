import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";

export const FREE_SPARKS_NAME = "freeSparks";
export const START_FREE_SPARKS_ACTION_NAME = "startFreeSparks";

const slice = createSlice( {
	name: FREE_SPARKS_NAME,
	initialState: {
		isFreeSparks: false,
		endpoint: "yoast/v1/ai/free_sparks",
	},
	reducers: {
		setFreeSparksEndpoint: ( state, { payload } ) => {
			state.endpoint = payload;
		},
		startFreeSparks: ( state ) => {
			state.isFreeSparks = true;
		},
	},
} );

export const getInitialTrial = slice.getInitialState;

export const freeSparksSelectors = {
	selectFreeSparksEndpoint: state => get( state, [ FREE_SPARKS_NAME, "endpoint" ], slice.getInitialState().endpoint ),
	selectIsFreeSparks: state => get( state, [ FREE_SPARKS_NAME, "isFreeSparks" ], slice.getInitialState().isFreeSparks ),
};

export const freeSparksActions = {
	...slice.actions,
};

export const freeSparksControls = {
	[ START_FREE_SPARKS_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		method: "POST",
		path: payload,
	} ),
};

export const freeSparksReducer = slice.reducer;
