import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, omit, reduce, values } from "lodash";
import apiFetch from "@wordpress/api-fetch";

/**
 * @returns {Object} The initial state.
 */
export const createInitialTaxonomiesState = () => reduce( get( window, "wpseoScriptData.taxonomies", {} ), ( acc, {
	postTypes,
	...taxonomy
}, name ) => ( {
	...acc,
	[ name ]: {
		...taxonomy,
		// Ensure array type of taxonomy post types.
		postTypes: values( postTypes ),
	},
} ), {} );

const UPDATE_REVIEW_ACTION_NAME = "updateTaxonomyReviewStatus";

/**
 * @param {String} taxonomyName The query data.
 * @returns {Object} Success or error action object.
 */
export function* updateTaxonomyReviewStatus( taxonomyName ) {
	try {
		yield{
			type: UPDATE_REVIEW_ACTION_NAME,
			payload: taxonomyName,
		};
	} catch ( error ) {
		console.error( `Error: Failed to remove "New" badge for ${taxonomyName}, ${error}` );
	}
	return { type: `${ UPDATE_REVIEW_ACTION_NAME }/result`, payload: taxonomyName };
}

const slice = createSlice( {
	name: "taxonomies",
	initialState: createInitialTaxonomiesState(),
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( `${ UPDATE_REVIEW_ACTION_NAME }/result`, ( state, { payload } ) => {
			state[ payload ].isNew = false;
		} );
	},
} );


const taxonomiesSelectors = {
	selectTaxonomy: ( state, taxonomyName, defaultValue = {} ) => get( state, `taxonomies.${ taxonomyName }`, defaultValue ),
	selectAllTaxonomies: state => get( state, "taxonomies", {} ),
};
// Create an exception for the `post_format` taxonomy. In the selectors instead of everywhere in the codebase.
taxonomiesSelectors.selectTaxonomies = createSelector(
	taxonomiesSelectors.selectAllTaxonomies,
	taxonomies => omit( taxonomies, [ "post_format" ] )
);

export { taxonomiesSelectors };

export const taxonomyControls = {
	[ UPDATE_REVIEW_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		path: "/yoast/v1/new-content-type-visibility/dismiss-taxonomy",
		method: "POST",
		// eslint-disable-next-line camelcase
		data: { taxonomy_name: payload },
	} ),
};

export const taxonomiesActions = {
	...slice.actions,
	updateTaxonomyReviewStatus,
};

export default slice.reducer;
