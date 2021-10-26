import { createSelector, createSlice } from "@reduxjs/toolkit";
import { reduce, upperFirst } from "lodash";

export const DATA_SLICE_NAME = "data";

const initialState = {
	seoTitle: "",
	metaDescription: "",
	date: "",
	permalink: "",
	slug: "",
	content: "",
	// Editor data we could use, for example in replacevars or for fallbacks.
	title: "",
	excerpt: "",
	featuredImage: {},
};

const data = createSlice( {
	name: DATA_SLICE_NAME,
	initialState,
	reducers: {
		updateContent: ( state, action ) => {
			state.content = action.payload;
		},
	},
} );

export const dataSelectors = reduce(
	initialState,
	( selectors, _, name ) => ( {
		...selectors,
		// E.g. selectSeoTitle: state => state.data.seoTitle
		[ `select${ upperFirst( name ) }` ]: state => state[ DATA_SLICE_NAME ][ name ],
	} ),
	{},
);
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
