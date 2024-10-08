import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialPreferencesState = () => ( {
	...get( window, "wpseoScriptData.preferences", {} ),
	ajaxUrl: get( window, "ajaxurl", "" ),
} );

const slice = createSlice( {
	name: "preferences",
	initialState: createInitialPreferencesState(),
	reducers: {},
} );

export const preferencesSelectors = {
	selectPreference: ( state, preference, defaultValue = {} ) => get( state, `preferences.${ preference }`, defaultValue ),
	selectPreferences: state => get( state, "preferences", {} ),
};
preferencesSelectors.selectUpsellSettingsAsProps = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "upsellSettings", {} ),
		( state, ctbName = "premiumCtbId" ) => ctbName,
	],
	( upsellSettings, ctbName ) => ( {
		"data-action": upsellSettings?.actionId,
		"data-ctb-id": upsellSettings?.[ ctbName ],
	} )
);

export const preferencesActions = slice.actions;

export default slice.reducer;
