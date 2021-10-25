import { createSlice } from "@reduxjs/toolkit";

const SLICE_NAME = "analysisData";

const analysisDataSlice = createSlice( {
	name: SLICE_NAME,
	initialState: {
		// NOTE: Do we need to send locale here?
		seoTitle: "Title",
		metaDescription: "",
		date: "",
		permalink: "",
		slug: "",
		content: "",
		keyphrases: [ "focus", "a", "b" ],
		synonyms: [ "", "a synonym", "b synonym" ],
	},
	reducers: {
		updateContent: ( state, action ) => {
			state.content = action.payload;
		},
	},
} );

const selectSeoTitle = state => state.analysisData.seoTitle;
const selectContent = state => state.analysisData.content;

export const analysisDataSelectors = {
	selectSeoTitle,
	selectContent,
};

export const analysisDataActions = analysisDataSlice.actions;

export default analysisDataSlice.reducer;
