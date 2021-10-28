import { createSlice } from "@reduxjs/toolkit";
import { createSimpleSelectors } from "../helpers";

export const CONFIG_SLICE_NAME = "config";

const initialState = {
	analysisType: "post",
	isSeoActive: true,
	isReadabilityActive: true,
	researches: [ "morphology" ],
};

const config = createSlice( {
	name: CONFIG_SLICE_NAME,
	initialState,
	reducers: {},
} );

export const configSelectors = createSimpleSelectors( CONFIG_SLICE_NAME, Object.keys( initialState ) );

export const configActions = config.actions;

export default config.reducer;
