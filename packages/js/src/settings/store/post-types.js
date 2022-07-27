import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

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
	selectPostTypes: state => get( state, "postTypes", {} ),
};

export const postTypesActions = slice.actions;

export default slice.reducer;
