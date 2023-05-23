import { createSelector, createSlice } from "@reduxjs/toolkit";
import { addQueryArgs } from "@wordpress/url";
import { get } from "lodash";

export const LINK_PARAMS_NAME = "linkParams";

/**
 * @returns {Object} The initial state.
 */
export const createInitialLinkParamsState = () => get( window, "wpseoScriptData.linkParams", {} );

const slice = createSlice( {
	name: LINK_PARAMS_NAME,
	initialState: createInitialLinkParamsState(),
	reducers: {},
} );

const linkParamsSelectors = {
	selectLinkParam: ( state, linkParam, defaultValue = {} ) => get( state, `${ LINK_PARAMS_NAME }.${ linkParam }`, defaultValue ),
	selectLinkParams: state => get( state, LINK_PARAMS_NAME, {} ),
};
linkParamsSelectors.selectLink = createSelector(
	[
		linkParamsSelectors.selectLinkParams,
		( state, url ) => url,
	],
	( linkParams, link ) => addQueryArgs( link, linkParams )
);

export { linkParamsSelectors };

export const linkParamsActions = slice.actions;

export const linkParamsReducer = slice.reducer;
