import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import apiFetch from "@wordpress/api-fetch";

/**
 * @returns {Object} The initial state.
 */
export const createInitialRedirectsState = () => get( window, "wpseoScriptData.redirects", {} );

const ADD_REDIRECT = "addRedirect";

/**
 * Generator-style action for @wordpress/data controls.
 * @param {Object} values The redirect values to submit.
 */
export function* addRedirect( values ) {
	yield{
		type: ADD_REDIRECT,
		payload: values,
	};
}

const slice = createSlice( {
	name: "redirects",
	initialState: createInitialRedirectsState(),
	reducers: {},
	extraReducers: () => {},
} );

export const redirectsSelectors = {};

export const redirectsControls = {
	[ ADD_REDIRECT ]: async( { payload } ) => apiFetch( {
		path: "/yoast/v1/redirects",
		method: "POST",
		data: payload,
	} ),
};

export const redirectsActions = {
	...slice.actions,
	addRedirect,
};

export default slice.reducer;
