import { createSlice } from "@reduxjs/toolkit";

const SLICE_NAME = "analysisConfig";

const analysisConfigSlice = createSlice( {
	name: SLICE_NAME,
	initialState: {
		// Do we need other config here?
		analysisType: "post",
		isSeoActive: true,
		isReadabilityActive: true,
	},
	reducers: {},
} );

export const analysisConfigSelectors = {};

export const analysisConfigActions = analysisConfigSlice.actions;

export default analysisConfigSlice.reducer;
