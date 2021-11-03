import { createSlice } from "@reduxjs/toolkit";
import { createSimpleReducers, createSimpleSelectors } from "../../helpers";

export const SEO_SLICE_NAME = "seo";

const initialState = {
	title: "",
	description: "",
	slug: "",
};

const seo = createSlice( {
	name: SEO_SLICE_NAME,
	initialState,
	reducers: createSimpleReducers( SEO_SLICE_NAME, Object.keys( initialState ) ),
} );

export const seoSelectors = createSimpleSelectors( SEO_SLICE_NAME, Object.keys( initialState ) );

export const seoActions = seo.actions;

export default seo.reducer;
