const { createSlice } = require( "@reduxjs/toolkit" );
import { get } from "lodash";

/**
 * Sets the default state.
 *
 * @param {Object} props The properties to use.
 */
export const defaultTwitterState = {
	title: "",
	description: "",
	image: {},
};

const twitterSlice = createSlice( {
	name: "twitter",
	initialState: defaultTwitterState,
	reducers: {
		updateTwitterTitle: ( state, action ) => {
			state.title = action.payload;
		},
		updateTwitterDescription: ( state, action ) => {
			state.description = action.payload;
		},
		updateTwitterImage: ( state, action ) => {
			state.image = action.payload;
		},
		updateTwitterData: ( state, action ) => {
			state = action.payload;
		},
		clearTwitterPreviewImage: ( state ) => {
			state.image = {};
		},
	},
} );

export const twitterSelectors = {
	selectTwitter: ( state ) => get( state, "form.social.twitter" ),
	selectTwitterTitle: ( state ) => get( state, "form.social.twitter.title" ),
	selectTwitterDescription: ( state ) => get( state, "form.social.twitter.description" ),
	selectTwitterImage: ( state ) => get( state, "form.social.twitter.image" ),
};

export const twitterActions = twitterSlice.actions;

export default twitterSlice.reducer;
