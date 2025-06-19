import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const PREFERENCES_NAME = "preferences";

const slice = createSlice( {
	name: PREFERENCES_NAME,
	initialState: {},
	reducers: {},
} );

export const getInitialPreferencesState = slice.getInitialState;

export const preferencesSelectors = {
	selectPreference: ( state, preference, defaultValue = {} ) => get( state, `${ PREFERENCES_NAME }.${ preference }`, defaultValue ),
	selectPreferences: state => get( state, PREFERENCES_NAME, {} ),
};

export const preferencesActions = slice.actions;

export const preferencesReducer = slice.reducer;
