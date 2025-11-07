import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const PLUGINS_URL_NAME = "pluginsUrl";

const slice = createSlice( {
	name: PLUGINS_URL_NAME,
	initialState: "",
	reducers: {
		setPluginsUrl: ( state, { payload } ) => payload,
	},
} );

export const getInitialPluginsUrlState = slice.getInitialState;

export const pluginsUrlSelectors = {
	selectPluginsUrl: state => get( state, PLUGINS_URL_NAME, "" ),
};

export const pluginsUrlActions = slice.actions;

export const pluginsUrlReducer = slice.reducer;
