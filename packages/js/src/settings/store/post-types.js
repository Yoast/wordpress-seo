import { createSlice } from "@reduxjs/toolkit";
import { get, pick } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialPostTypesState = () => get( window, "wpseoScriptData.postTypes", {} );

const slice = createSlice( {
	name: "postTypes",
	initialState: createInitialPostTypesState(),
	reducers: {},
} );

export const postTypesSelectors = {
	selectPostType: ( state, postType, defaultValue = {} ) => get( state, `postTypes.${ postType }`, defaultValue ),
	selectPostTypes: ( state, postTypes = null ) => {
		const all = get( state, "postTypes", {} );
		return postTypes ? pick( all, postTypes ) : all;
	},
};

export const postTypesActions = slice.actions;

export default slice.reducer;
