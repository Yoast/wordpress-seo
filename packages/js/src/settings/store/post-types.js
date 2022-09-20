import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, omit, pick } from "lodash";

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
	selectAllPostTypes: ( state, postTypes = null ) => {
		const all = get( state, "postTypes", {} );
		return postTypes ? pick( all, postTypes ) : all;
	},
};
// Create an exception for the `attachment` post type. In the selectors instead of everywhere in the codebase.
postTypesSelectors.selectPostTypes = createSelector(
	postTypesSelectors.selectAllPostTypes,
	postTypes => omit( postTypes, [ "attachment" ] )
);

export const postTypesActions = slice.actions;

export default slice.reducer;
