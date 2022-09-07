import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { addQueryArgs } from "@wordpress/url";
import { createLink } from "../helpers";

console.warn( "createLink", createLink( "https://www.google.com/webmasters/verification/verification", { hl: "en", tid: "alternate" } ) );
console.warn( "addQueryArgs", addQueryArgs( "https://www.google.com/webmasters/verification/verification", { hl: "en", tid: "alternate" } ) );

/**
 * @returns {Object} The initial state.
 */
export const createInitialLinkParamsState = () => get( window, "wpseoScriptData.linkParams", {} );

const slice = createSlice( {
	name: "linkParams",
	initialState: createInitialLinkParamsState(),
	reducers: {},
} );

const linkParamsSelectors = {
	selectLinkParam: ( state, linkParam, defaultValue = {} ) => get( state, `linkParams.${ linkParam }`, defaultValue ),
	selectLinkParams: state => get( state, "linkParams", {} ),
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

export default slice.reducer;
