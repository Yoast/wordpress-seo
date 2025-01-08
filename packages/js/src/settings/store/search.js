import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, reduce, join, filter, isArray } from "lodash";
import { preferencesSelectors } from "./preferences";
import { createSearchIndex, safeToLocaleLower } from "../helpers";

/**
 * @param {Object} item Search index entry.
 * @param {Object} options The options.
 * @param {string} options.userLocale The user locale string.
 * @returns {string} The keywords string with added route and field labels.
 */
const createSearchItemKeywords = ( item, { userLocale } ) => safeToLocaleLower( join( [
	...( isArray( item?.keywords ) ? item.keywords : [] ),
	item?.routeLabel,
	item?.fieldLabel,
], " " ), userLocale );

/**
 * Flattens the search index and lowercases some props for easy querying.
 * @param {Object} searchIndex The search index.
 * @param {string} parentPath The parent object path.
 * @param {Object} options The options.
 * @param {string} options.userLocale The user locale string.
 * @returns {Object} The flattened search index.
 */
const flattenAndLowerSearchIndex = ( searchIndex, parentPath = "", { userLocale } ) => reduce(
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
					keywords: createSearchItemKeywords( item, { userLocale } ),
				},
			};
		}

		return item?.route ? {
			...acc,
			[ flatKey ]: {
				...item,
				keywords: createSearchItemKeywords( item, { userLocale } ),
			},
		} : {
			...acc,
			...flattenAndLowerSearchIndex( item, flatKey, { userLocale } ),
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
	const userLocale = get( window, "wpseoScriptData.preferences.userLocale", {} );

	return {
		index: createSearchIndex( postTypes, taxonomies, { userLocale } ),
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
	[
		searchSelectors.selectSearchIndex,
		state => preferencesSelectors.selectPreference( state, "userLocale" ),
	],
	( searchIndex, userLocale ) => flattenAndLowerSearchIndex( searchIndex, "", { userLocale } )
);

export const searchActions = slice.actions;

export default slice.reducer;
