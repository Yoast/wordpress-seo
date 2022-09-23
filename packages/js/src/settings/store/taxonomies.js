import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, head, indexOf, lastIndexOf, map, omit, reduce, values } from "lodash";
import { postTypesSelectors } from "./post-types";

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

const slice = createSlice( {
	name: "taxonomies",
	initialState: createInitialTaxonomiesState(),
	reducers: {},
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
taxonomiesSelectors.selectTaxonomyFirstPostType = createSelector(
	[
		taxonomiesSelectors.selectTaxonomy,
		state => postTypesSelectors.selectAllPostTypes( state ),
	],
	( taxonomy, postTypes ) => get( postTypes, head( taxonomy?.postTypes ), null )
);
taxonomiesSelectors.selectTaxonomyLabels = createSelector(
	taxonomiesSelectors.selectAllTaxonomies,
	taxonomies => map( taxonomies, "label" ) || []
);
taxonomiesSelectors.selectIsTaxonomyLabelUnique = createSelector(
	[
		taxonomiesSelectors.selectTaxonomy,
		taxonomiesSelectors.selectTaxonomyLabels,
	],
	( taxonomy, taxonomyLabels ) => indexOf( taxonomyLabels, taxonomy?.label ) === lastIndexOf( taxonomyLabels, taxonomy?.label )
);
taxonomiesSelectors.selectTaxonomyHasPostTypeBadge = createSelector(
	[
		taxonomiesSelectors.selectTaxonomyFirstPostType,
		taxonomiesSelectors.selectIsTaxonomyLabelUnique,
	],
	( firstPostType, isLabelUnique ) => ! isLabelUnique && Boolean( firstPostType )
);

export { taxonomiesSelectors };

export const taxonomiesActions = slice.actions;

export default slice.reducer;
