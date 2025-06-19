import { createSelector, createSlice } from "@reduxjs/toolkit";
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
preferencesSelectors.selectUpsellSettingsAsProps = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "upsellSettings", {} ),
		( state, scope = "premium" ) => scope,
	],
	( upsellSettings, scope ) => ( {
		"data-action": upsellSettings?.[ scope ]?.actionId,
		"data-ctb-id": upsellSettings?.[ scope ]?.ctbId,
	} )
);

export const preferencesActions = slice.actions;

export const preferencesReducer = slice.reducer;
