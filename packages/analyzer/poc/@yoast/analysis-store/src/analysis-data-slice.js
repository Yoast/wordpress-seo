import { createSlice } from "@reduxjs/toolkit";

const SLICE_NAME = "analysisData";

const analysisDataSlice = createSlice( {
	name: SLICE_NAME,
	initialState: {
		content: "",
	},
	reducers: {
		updatedContent: ( state, action ) => {
			state.content = action.payload;
		},
	},
} );

const selectContent = state => state.analysisData.content;

export const analysisDataSelectors = {
	selectContent,
};

export const analysisDataActions = analysisDataSlice.actions;

export default analysisDataSlice.reducer;
