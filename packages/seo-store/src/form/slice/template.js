const { createSlice } = require( "@reduxjs/toolkit" );
import { get } from "lodash";

export const defaultTemplateState = {
	description: "",
	title: "",
	titleNoFallback: "",
};

const templateSlice = createSlice( {
	name: "template",
	initialState: defaultTemplateState,
	reducers: {
		updateDescriptionTemplate: ( state, action ) => {
			state.description = action.payload;
		},
		updateTitleTemplate: ( state, action ) => {
			state.title = action.payload;
		},
		updateTitleTemplateNoFallback: ( state, action ) => {
			state.titleNoFallback = action.payload;
		},
	},
} );

export const templateSelectors = {
	selectSeoTemplates: ( state ) => get( state, "form.template" ),
	selectDescriptionTemplate: ( state ) => get( state, "form.template.description" ),
	selectTitleTemplate: ( state ) => get( state, "form.template.title" ),
	selectTitleTemplateNoFallback: ( state ) => get( state, "form.template.titleNoFallback" ),
};

export const templateActions = templateSlice.actions;

export default templateSlice.reducer;
