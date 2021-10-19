import { createSlice } from "@reduxjs/toolkit";

const analysisDataSlice = createSlice( {
	name: "analysisData",
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

export const selectors = {
	selectContent,
};

export const actions = analysisDataSlice.actions;

export default analysisDataSlice.reducer;
