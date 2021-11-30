import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const defaultSeoState = {
	title: "",
	description: "",
	slug: "",
	isCornerstone: false,
};

const seoSlice = createSlice( {
	name: "seo",
	initialState: defaultSeoState,
	reducers: {
		updateSeoTitle: ( state, action ) => {
			state.title = action.payload;
		},
		updateMetaDescription: ( state, action ) => {
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
	selectMetaDescription: state => get( state, "form.seo.description" ),
	selectSlug: state => get( state, "form.seo.slug" ),
	selectIsCornerstone: state => get( state, "form.seo.isCornerstone" ),
};

export const seoActions = seoSlice.actions;

export default seoSlice.reducer;
