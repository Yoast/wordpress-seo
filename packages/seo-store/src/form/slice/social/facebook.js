const { createSlice } = require( "@reduxjs/toolkit" );
import { get } from "lodash";

export const defaultFacebookState = {
	title: "",
	description: "",
	image: {},
};

const facebookSlice = createSlice( {
	name: "facebook",
	initialState: defaultFacebookState,
	reducers: {
		updateTitle: ( state, action ) => {
			state.title = action.payload;
		},
		updateDescription: ( state, action ) => {
			state.description = action.payload;
		},
		updateImage: ( state, action ) => {
			state.image = action.payload;
		},
	},
} );

export const facebookSelectors = {
	selectFacebook: ( state ) => get( state, "facebook" ),
	selectTitle: ( state ) => get( state, "facebook.title" ),
	selectDescription: ( state ) => get( state, "facebook.description" ),
	selectImage: ( state ) => get( state, "facebook.image" ),
};

export const facebookActions = facebookSlice.actions;

export default facebookSlice.reducer;
