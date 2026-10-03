import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const ENDPOINTS_NAME = "endpoints";

const slice = createSlice( {
	name: ENDPOINTS_NAME,
	initialState: {
		getSuggestions: "",
		bustSubscriptionCache: "",
	},
	reducers: {},
} );

export const getInitialEndpointsState = slice.getInitialState;

export const endpointsSelectors = {
	selectGetSuggestionsEndpoint: ( state ) =>
		get( state, [ ENDPOINTS_NAME, "getSuggestions" ], slice.getInitialState().getSuggestions ),
	selectBustSubscriptionCacheEndpoint: ( state ) =>
		get( state, [ ENDPOINTS_NAME, "bustSubscriptionCache" ], slice.getInitialState().bustSubscriptionCache ),
};

export const endpointsActions = {
	...slice.actions,
};

export const endpointsReducer = slice.reducer;
