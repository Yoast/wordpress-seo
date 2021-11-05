import { createSlice } from "@reduxjs/toolkit";
import { createSimpleReducers, createSimpleSelectors } from "../../common/helpers";

export const CONFIG_SLICE_NAME = "config";

const initialState = {
	analysisType: "post",
	isSeoActive: true,
	isReadabilityActive: true,
	researches: [ "morphology" ],
};

const configSlice = createSlice( {
	name: CONFIG_SLICE_NAME,
	initialState,
	reducers: {
		...createSimpleReducers( Object.keys( initialState ) ),
		addResearch: ( state, payload ) => {
			state.researches.push( payload );
		},
		removeResearch: ( state, payload ) => {
			state.researches.filter( research => research !== payload );
		},
	},
} );

export const configSelectors = createSimpleSelectors( CONFIG_SLICE_NAME, Object.keys( initialState ) );

export const configActions = configSlice.actions;

export default configSlice.reducer;
