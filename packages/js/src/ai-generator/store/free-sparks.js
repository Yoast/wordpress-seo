import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES } from "../../shared-admin/constants";

export const FREE_SPARKS_NAME = "freeSparks";
export const START_FREE_SPARKS_ACTION_NAME = "activateFreeSparks";

const slice = createSlice( {
	name: FREE_SPARKS_NAME,
	initialState: {
		isFreeSparksActive: false,
		endpoint: "yoast/v1/ai/free_sparks",
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ START_FREE_SPARKS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state ) => {
			state.isFreeSparksActive = true;
		} );
	},
} );

export const getInitialFreeSparks = slice.getInitialState;

export const freeSparksSelectors = {
	selectFreeSparksActiveEndpoint: state => get( state, [ FREE_SPARKS_NAME, "endpoint" ], slice.getInitialState().endpoint ),
	selectIsFreeSparksActive: state => get( state, [ FREE_SPARKS_NAME, "isFreeSparksActive" ], slice.getInitialState().isFreeSparksActive ),
};

/**
 * @param {string} endpoint The endpoint to start the free sparks from.
 * @returns {Object} Success or error action object.
 */
export function* activateFreeSparks( { endpoint } ) {
	try {
		yield{ type: START_FREE_SPARKS_ACTION_NAME, payload: endpoint };
	} catch ( error ) {
		console.error( "Error starting free sparks:", error );
	}
	return { type: `${ START_FREE_SPARKS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }` };
}

export const freeSparksActions = {
	...slice.actions,
	activateFreeSparks,
};

export const freeSparksControls = {
	[ START_FREE_SPARKS_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		method: "POST",
		path: payload,
	} ),
};

export const freeSparksReducer = slice.reducer;
