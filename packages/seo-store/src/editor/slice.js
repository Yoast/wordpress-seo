import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

const initialState = {
	content: "",
	title: "",
	permalink: "",
	excerpt: "",
	date: "",
	featuredImage: {},
};

const editorSlice = createSlice( {
	name: "editor",
	initialState,
	reducers: {
		updateContent: ( state, action ) => {
			state.content = action.payload;
		},
		updateTitle: ( state, action ) => {
			state.title = action.payload;
		},
		updatePermalink: ( state, action ) => {
			state.permalink = action.payload;
		},
		updateExcerpt: ( state, action ) => {
			state.excerpt = action.payload;
		},
		updateDate: ( state, action ) => {
			state.date = action.payload;
		},
		updateFeaturedImage: ( state, action ) => {
			state.featuredImage = action.payload;
		},
	},
} );

export const editorSelectors = {
	selectEditor: ( state ) => get( state, "editor" ),
	selectContent: ( state ) => get( state, "editor.content" ),
	selectTitle: ( state ) => get( state, "editor.title" ),
	selectPermalink: ( state ) => get( state, "editor.permalink" ),
	selectExcerpt: ( state ) => get( state, "editor.excerpt" ),
	selectDate: ( state ) => get( state, "editor.date" ),
	selectFeaturedImage: ( state ) => get( state, "editor.featuredImage" ),
};

export const editorActions = editorSlice.actions;

export default editorSlice.reducer;
