import { createSlice } from "@reduxjs/toolkit";

export const DATA_SLICE_NAME = "data";

const data = createSlice( {
	name: DATA_SLICE_NAME,
	initialState: {
		// NOTE: Do we need to send locale here?
		seoTitle: "Title",
		metaDescription: "",
		date: "",
		permalink: "",
		slug: "",
		content: "",
	},
	reducers: {
		updatedContent: ( state, action ) => {
			state.content = action.payload;
		},
	},
} );

const selectTitle = state => state[ DATA_SLICE_NAME ].title;
const selectContent = state => state[ DATA_SLICE_NAME ].content;

export const dataSelectors = {
	selectTitle,
	selectContent,
};

export const dataActions = data.actions;

export default data.reducer;
