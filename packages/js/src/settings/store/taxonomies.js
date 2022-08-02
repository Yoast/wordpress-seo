import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialTaxonomiesState = () => get( window, "wpseoScriptData.taxonomies", {} );

const slice = createSlice( {
	name: "taxonomies",
	initialState: createInitialTaxonomiesState(),
	reducers: {},
} );

const taxonomiesSelectors = {
	selectTaxonomy: ( state, taxonomy, defaultValue = {} ) => get( state, `taxonomies.${ taxonomy }`, defaultValue ),
	selectAllTaxonomies: state => get( state, "taxonomies", {} ),
};
// Create an exception for the `post_format` taxonomy. In the selectors instead of everywhere in the codebase.
taxonomiesSelectors.selectTaxonomies = createSelector(
	taxonomiesSelectors.selectAllTaxonomies,
	taxonomies => omit( taxonomies, [ "post_format" ] )
);

export { taxonomiesSelectors };

export const taxonomiesActions = slice.actions;

export default slice.reducer;
