import { createSlice } from "@reduxjs/toolkit";
import { createSimpleReducers, createSimpleSelectors } from "../../common/helpers";

export const SEO_SLICE_NAME = "seo";

const initialState = {
	title: "",
	description: "",
	slug: "",
};

const seoSlice = createSlice( {
	name: SEO_SLICE_NAME,
	initialState,
	reducers: createSimpleReducers( Object.keys( initialState ) ),
} );

export const seoSelectors = createSimpleSelectors( SEO_SLICE_NAME, Object.keys( initialState ) );

export const seoActions = seoSlice.actions;

export default seoSlice.reducer;
