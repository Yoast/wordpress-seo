import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialDefaultSettingsState = () => ( {
	...get( window, "wpseoScriptData.defaultSettings", {} ),
	upsellSettings: get( window, "wpseoScriptData.upsellSettings", {} ),
} );

const slice = createSlice( {
	name: "defaultSettings",
	initialState: createInitialDefaultSettingsState(),
	reducers: {},
} );

export const defaultSettingsSelectors = {
	selectDefaultSetting: ( state, setting, defaultValue = {} ) => get( state, `defaultSettings.${ setting }`, defaultValue ),
	selectUpsellSetting: state => get( state, "defaultSettings.upsellSettings", {} ),
	selectDefaultSettings: state => get( state, "defaultSettings", {} ),
};

export const defaultSettingsActions = slice.actions;

export default slice.reducer;
