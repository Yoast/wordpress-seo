import { createSelector, createSlice } from "@reduxjs/toolkit";
import { createSimpleReducers, createSimpleSelectors } from "../helpers";

export const DATA_SLICE_NAME = "formSeo";

export type FormSeoState = {
	title: string;
	description: string;
	slug: string;
};

const initialState: FormSeoState = {
	title: "",
	description: "",
	slug: "",
};

const data = createSlice( {
	name: DATA_SLICE_NAME,
	initialState,
	reducers: createSimpleReducers( DATA_SLICE_NAME, Object.keys( initialState ) ),
} );

export const dataSelectors = createSimpleSelectors( DATA_SLICE_NAME, Object.keys( initialState ) );
dataSelectors.selectPaper = createSelector(
	dataSelectors.selectSeoTitle,
	dataSelectors.selectMetaDescription,
	dataSelectors.selectDate,
	dataSelectors.selectPermalink,
	dataSelectors.selectSlug,
	dataSelectors.selectContent,
	( seoTitle, metaDescription, date, permalink, slug, content ) => ( {
		seoTitle,
		metaDescription,
		date,
		permalink,
		slug,
		content,
	} ),
);

export const dataActions = data.actions;

export default data.reducer;
