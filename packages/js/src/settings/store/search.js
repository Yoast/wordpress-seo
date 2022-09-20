/* eslint-disable camelcase */
import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { createSearchIndex } from "../helpers";


/**
 * @returns {Object} Initial search state.
 */
export const createInitialSearchState = () => {
	const postTypes = get( window, "wpseoScriptData.postTypes", {} );
	const taxonomies = get( window, "wpseoScriptData.taxonomies", {} );

	return {
		query: "",
		index: createSearchIndex( postTypes, taxonomies ),
	};
};

const slice = createSlice( {
	name: "search",
	initialState: createInitialSearchState(),
	reducers: {},
} );

export const searchSelectors = {
	selectSearchIndex: ( state ) => get( state, "search.index", {} ),
	// selectFlatSearchIndex: ( state ) => get( state, "search.ndex", {} ),
};

export const searchActions = slice.actions;

export default slice.reducer;
