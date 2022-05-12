const { createSlice } = require( "@reduxjs/toolkit" );
import { get } from "lodash";

export const defaultSocialTemplate = {
	description: "",
	title: "",
};

const socialTemplateSlice = createSlice( {
	name: "template",
	initialState: defaultSocialTemplate,
	reducers: {
		updateSocialDescriptionTemplate: ( state, action ) => {
			state.description = action.payload;
		},
		updateSocialTitleTemplate: ( state, action ) => {
			state.title = action.payload;
		},
	},
} );

export const socialTemplateSelectors = {
	selectSocialDescriptionTemplate: ( state ) => get( state, "form.social.template.description" ),
	selectSocialTitleTemplate: ( state ) => get( state, "form.social.template.title" ),
};

export const socialTemplateActions = socialTemplateSlice.actions;

export default socialTemplateSlice.reducer;
