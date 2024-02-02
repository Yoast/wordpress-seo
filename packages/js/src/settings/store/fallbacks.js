import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialFallbacksState = () => get( window, "wpseoScriptData.fallbacks", {} );

const slice = createSlice( {
	name: "fallbacks",
	initialState: createInitialFallbacksState(),
	reducers: {},
} );

export const fallbacksSelectors = {
	selectFallback: ( state, preference, defaultValue = {} ) => get( state, `fallbacks.${ preference }`, defaultValue ),
	selectFallbacks: state => get( state, "fallbacks", {} ),
};

export const fallbacksActions = slice.actions;

export default slice.reducer;
