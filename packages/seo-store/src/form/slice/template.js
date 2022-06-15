const { createSlice } = require( "@reduxjs/toolkit" );
import { get } from "lodash";

export const defaultTemplateState = {
	description: "",
	title: "",
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
	},
} );

export const templateSelectors = {
	selectDescriptionTemplate: ( state ) => get( state, "form.template.description" ),
	selectTitleTemplate: ( state ) => get( state, "form.template.title" ),
};

export const templateActions = templateSlice.actions;

export default templateSlice.reducer;
