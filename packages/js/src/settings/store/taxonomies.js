import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialTaxonomiesState = () => get( window, "wpseoScriptData.taxonomies", {} );

const slice = createSlice( {
	name: "taxonomies",
	initialState: createInitialTaxonomiesState(),
	reducers: {},
} );

export const taxonomiesSelectors = {
	selectTaxonomy: ( state, taxonomy, defaultValue = {} ) => get( state, `taxonomies.${ taxonomy }`, defaultValue ),
	selectTaxonomies: state => get( state, "taxonomies", {} ),
};

export const taxonomiesActions = slice.actions;

export default slice.reducer;
