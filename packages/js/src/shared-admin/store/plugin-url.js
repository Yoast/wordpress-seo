import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, trim, trimEnd, trimStart } from "lodash";

export const PLUGIN_URL_NAME = "pluginUrl";

const slice = createSlice( {
	name: PLUGIN_URL_NAME,
	initialState: "",
	reducers: {
		setPluginUrl: ( state, { payload } ) => payload,
	},
} );

export const getInitialPluginUrlState = slice.getInitialState;

export const pluginUrlSelectors = {
	selectPluginUrl: state => get( state, PLUGIN_URL_NAME, "" ),
};
pluginUrlSelectors.selectImageLink = createSelector(
	[
		pluginUrlSelectors.selectPluginUrl,
		( state, link, imageBase = "images" ) => imageBase,
		( state, link ) => link,
	],
	( pluginUrl, imageBase, link ) => [
		trimEnd( pluginUrl, "/" ),
		trim( imageBase, "/" ),
		trimStart( link, "/" ),
	].join( "/" )
);

export const pluginUrlActions = slice.actions;

export const pluginUrlReducer = slice.reducer;
