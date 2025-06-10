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
		setFreeSparks: ( state, { payload = true } ) => {
			state.isFreeSparks = payload;
		},
		setFreeSparksEndpoint: ( state, { payload } ) => {
			state.endpoint = payload;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( START_FREE_SPARKS_ACTION_NAME, ( state ) => {
			state.isFreeSparks = true;
		} );
	},
} );

export const getInitialFreeSparks = slice.getInitialState;

export const freeSparksSelectors = {
	selectFreeSparksEndpoint: state => get( state, [ FREE_SPARKS_NAME, "endpoint" ], slice.getInitialState().endpoint ),
	selectIsFreeSparks: state => get( state, [ FREE_SPARKS_NAME, "isFreeSparks" ], slice.getInitialState().isFreeSparks ),
};

/**
 * @param {string} endpoint The endpoint to start the freeSparks from.
 * @returns {Object} Success or error action object.
 */
export function* startFreeSparks( { endpoint } ) {
	try {
		yield{ type: START_FREE_SPARKS_ACTION_NAME, payload: endpoint };
	} catch ( error ) {
		console.error( "Error starting free sparks:", error );
	}
	return { type: `${ START_FREE_SPARKS_ACTION_NAME }` };
}

export const freeSparksActions = {
	...slice.actions,
	startFreeSparks,
};

export const freeSparksControls = {
	[ START_FREE_SPARKS_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		method: "POST",
		path: payload,
	} ),
};

export const freeSparksReducer = slice.reducer;
