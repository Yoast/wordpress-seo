import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

const initialState = {
	title: "",
	description: "",
	slug: "",
	isCornerstone: false,
};

const seoSlice = createSlice( {
	name: "seo",
	initialState,
	reducers: {
		updateSeoTitle: ( state, action ) => {
			state.title = action.payload;
		},
		updateSeoDescription: ( state, action ) => {
			state.description = action.payload;
		},
		updateSlug: ( state, action ) => {
			state.slug = action.payload;
		},
		updateIsCornerstone: ( state, action ) => {
			state.isCornerstone = Boolean( action.payload );
		},
	},
} );

export const seoSelectors = {
	selectSeo: state => get( state, "form.seo" ),
	selectSeoTitle: state => get( state, "form.seo.title" ),
	selectSeoDescription: state => get( state, "form.seo.description" ),
	selectSlug: state => get( state, "form.seo.slug" ),
	selectIsCornerstone: state => get( state, "form.seo.isCornerstone" ),
};

export const seoActions = seoSlice.actions;

export default seoSlice.reducer;
