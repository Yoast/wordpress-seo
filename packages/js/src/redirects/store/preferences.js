import { createSlice } from "@reduxjs/toolkit";
import { defaultTo, get } from "lodash";

export const PREFERENCES_NAME = "preferences";

/**
 * @returns {Object} The initial state.
 */
export const createInitialPreferencesState = () => ( {
	isPremium: false,
	isRtl: false,
	documentTitle: defaultTo( document?.title, "" ),
} );

const slice = createSlice( {
	name: PREFERENCES_NAME,
	initialState: createInitialPreferencesState(),
	reducers: {},
} );

export const preferencesSelectors = {
	selectPreference: ( state, preference, defaultValue = {} ) => get( state, `${PREFERENCES_NAME}.${ preference }`, defaultValue ),
	selectPreferences: state => get( state, PREFERENCES_NAME, {} ),
};

export const preferencesActions = slice.actions;

export default slice.reducer;
