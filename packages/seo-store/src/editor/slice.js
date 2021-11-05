import { createSlice } from "@reduxjs/toolkit";
import { createSimpleReducers, createSimpleSelectors } from "../common/helpers";

export const EDITOR_SLICE_NAME = "editor";

const initialState = {
	content: "",
	title: "",
	permalink: "",
	excerpt: "",
	date: "",
	featuredImage: {},
};

const editorSlice = createSlice( {
	name: EDITOR_SLICE_NAME,
	initialState,
	reducers: createSimpleReducers( Object.keys( initialState ) ),
} );

export const editorSelectors = createSimpleSelectors( EDITOR_SLICE_NAME, Object.keys( initialState ) );

export const editorActions = editorSlice.actions;

export default editorSlice.reducer;
