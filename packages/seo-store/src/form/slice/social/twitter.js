const { createSlice } = require( "@reduxjs/toolkit" );
import { get } from "lodash";
import { reducers, selectors, actions } from "@yoast/externals/redux";

/**
 * Sets the default state.
 *
 * @param {Object} props The properties to use.
 */
export const defaultTwitterState = {
	form: {
		social: {
			twitter: {
				title: "",
				description: "",
				image: {
					id: "",
					url: "",
					width: "",
					height: "",
					alt: "",
				}
			}
		}
	}
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
	},
} );

export const twitterActions = twitterSlice.actions;

export default twitterSlice.reducer;
