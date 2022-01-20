import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const defaultEditorState = {
	content: "",
	title: "",
	permalink: "",
	excerpt: "",
	date: "",
	featuredImage: {},
	categories: [],
	locale: "",
};

const editorSlice = createSlice( {
	name: "editor",
	initialState: defaultEditorState,
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
		updateCategories: ( state, action ) => {
			state.categories = action.payload;
		},
		updateLocale: ( state, action ) => {
			state.locale = action.payload;
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
	selectCategories: ( state ) => get( state, "editor.categories" ),
	selectLocale: ( state ) => get( state, "editor.locale" ),
};

export const editorActions = editorSlice.actions;

export default editorSlice.reducer;
