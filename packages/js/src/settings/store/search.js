/* eslint-disable camelcase */
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { createSearchIndex } from "../helpers";
import { flattenObject } from "../utils";

/**
 * Determines if the given value should flatten.
 * @param {*} value The value.
 * @returns {boolean} True if the value is an object or an array.
 */
export const getShouldFlattenSearchIndex = value =>  ! value?.route;

/**
 * @returns {Object} Initial search state.
 */
export const createInitialSearchState = () => {
	const postTypes = get( window, "wpseoScriptData.postTypes", {} );
	const taxonomies = get( window, "wpseoScriptData.taxonomies", {} );

	return {
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
};
searchSelectors.selectFlatSearchIndex = createSelector(
	searchSelectors.selectSearchIndex,
	searchIndex => flattenObject( searchIndex, "", getShouldFlattenSearchIndex )
);

export const searchActions = slice.actions;

export default slice.reducer;
