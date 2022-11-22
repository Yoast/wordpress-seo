/* eslint-disable camelcase */
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, reduce, join, filter, toLower, isArray } from "lodash";
import { createSearchIndex } from "../helpers";

/**
 * @param {Object} item Search index entry.
 * @returns {string} The keywords string with added route and field labels.
 */
const createSearchItemKeywords = item => toLower( join( [
	...( isArray( item?.keywords ) ? item.keywords : [] ),
	item?.routeLabel,
	item?.fieldLabel,
], " " ) );

/**
 * Flattens the search index and lowercases some props for easy querying.
 * @param {Object} searchIndex The search index.
 * @param {string} parentPath The parent object path.
 * @returns {Object} The flattened search index.
 */
const flattenAndLowerSearchIndex = ( searchIndex, parentPath = "" ) => reduce(
	searchIndex,
	( acc, item, key ) => {
		const flatKey = join( filter( [ parentPath, key ], Boolean ), "." );

		// Exception for other social URLs: only have one entry in queryable search index.
		if ( key === "other_social_urls" ) {
			return {
				...acc,
				[ flatKey ]: {
					route: item?.route,
					routeLabel: item?.routeLabel,
					fieldId: item?.fieldId,
					fieldLabel: item?.fieldLabel,
					keywords: createSearchItemKeywords( item ),
				},
			};
		}

		return item?.route ? {
			...acc,
			[ flatKey ]: {
				...item,
				keywords: createSearchItemKeywords( item ),
			},
		} : {
			...acc,
			...flattenAndLowerSearchIndex( item, flatKey ),
		};
	},
	{}
);

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
searchSelectors.selectQueryableSearchIndex = createSelector(
	searchSelectors.selectSearchIndex,
	searchIndex => flattenAndLowerSearchIndex( searchIndex )
);

export const searchActions = slice.actions;

export default slice.reducer;
