import { createSlice } from "@reduxjs/toolkit";
import { get, set } from "lodash";
// Custom selectors.
import selectFormattedDate from "./selectors/selectFormattedDate";

export const defaultEditorState = {
	content: "",
	title: "",
	permalink: "",
	excerpt: "",
	date: "",
	featuredImage: {},
	taxonomies: {},
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
		updateTerms: ( state, action ) => {
			const terms = action.payload.terms;
			const taxonomyType = action.payload.taxonomyType;

			set( state, "taxonomies." + taxonomyType, terms );
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
	selectTerms: ( state, taxonomyType ) =>  get( state, "editor.taxonomies." + taxonomyType, [] ),
	selectLocale: ( state ) => get( state, "editor.locale" ),
	selectFormattedDate,
};

export const editorActions = editorSlice.actions;

export default editorSlice.reducer;
