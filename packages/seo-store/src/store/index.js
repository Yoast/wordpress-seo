import { combineReducers, createReduxStore } from "@wordpress/data";
import { identity } from "lodash";
import { STORE_NAME } from "../constants";
import formReducer, { FORM_SLICE_NAME } from "./form";

export const actions = {
};

export const selectors = {
};

/**
 * Creates a WP data store for managing SEO data.
 *
 * @param {function} analyze The function to analyze paper data based on keyphrases and configuration.
 * @returns {WPDataStore} The WP data store.
 */
const createSeoStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
} ) => {
	return createReduxStore( STORE_NAME, {
		actions,
		selectors,
		reducer: combineReducers( {
			[ ANALYSIS_SLICE_NAME ]: analysisReducer,
			[ EDITOR_SLICE_NAME ]: editorReducer,
			[ FORM_SLICE_NAME ]: formReducer,
		} ),
		controls: {
			[ ANALYZE_ACTION_NAME ]: async ( { payload: { paper, keyphrases, config } } ) => analyze( paper, keyphrases, config ),
			[ PREPARE_PAPER_ACTION_NAME ]: async ( { payload } ) => preparePaper( payload ),
			[ PROCESS_RESULTS_ACTION_NAME ]: async ( { payload } ) => processResults( payload ),
		},
	} );
};

export default createSeoStore;
