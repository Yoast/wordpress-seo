import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const defaultSeoState = {
	title: "",
	description: "",
	slug: "",
	titleTemplate: "",
	descriptionTemplate: "",
};

const seoSlice = createSlice( {
	name: "seo",
	initialState: defaultSeoState,
	reducers: {
		updateSeoTitle: ( state, action ) => {
			// Trim spaces from the beginning and end of the data to make a fair comparison with the template.
			// This additional check is done so that we don't save templates as SEO title in the store.
			if ( action.payload.trim() === state.titleTemplate ) {
				action.payload = "";
			}
			state.title = action.payload;
		},
		updateMetaDescription: ( state, action ) => {
			// Trim spaces from the beginning and end of the data to make a fair comparison with the template.
			// This additional check is done so that we don't save templates as the meta description in the store.
			if ( action.payload.trim() === state.descriptionTemplate ) {
				action.payload = "";
			}
			state.description = action.payload;
		},
		updateSlug: ( state, action ) => {
			state.slug = action.payload;
		},
		updateTitleTemplate: ( state, action ) => {
			state.titleTemplate = action.payload;
		},
		updateDescriptionTemplate: ( state, action ) => {
			state.descriptionTemplate = action.payload;
		},
	},
} );

export const seoSelectors = {
	selectSeo: state => get( state, "form.seo" ),
	selectSeoTitle: state => get( state, "form.seo.title" ),
	selectMetaDescription: state => get( state, "form.seo.description" ),
	selectSlug: state => get( state, "form.seo.slug" ),
	selectTitleTemplate: ( state ) => get( state, "form.seo.titleTemplate" ),
	selectDescriptionTemplate: ( state ) => get( state, "form.seo.descriptionTemplate" ),
};

export const seoActions = seoSlice.actions;

export default seoSlice.reducer;
