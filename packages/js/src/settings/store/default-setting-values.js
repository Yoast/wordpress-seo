import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialDefaultSettingValuesState = () => ( {
	...get( window, "wpseoScriptData.defaultSettingValues", {} ),
} );

const slice = createSlice( {
	name: "defaultSettingValues",
	initialState: createInitialDefaultSettingValuesState(),
	reducers: {},
} );

export const defaultSettingValuesSelectors = {
	selectDefaultSettingValue: ( state, setting, defaultValue = {} ) => get( state, `defaultSettingValues.${ setting }`, defaultValue ),
	selectDefaultSettingValues: state => get( state, "defaultSettingValues", {} ),
};

export const defaultSettingValuesActions = slice.actions;

export default slice.reducer;
