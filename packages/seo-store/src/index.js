import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { identity } from "lodash";
import { ANALYZE_ACTION_NAME, PREPARE_PAPER_ACTION_NAME, PROCESS_RESULTS_ACTION_NAME } from "./analysis/slice/results";
import analysisReducer, { ANALYSIS_SLICE_NAME, analysisActions, analysisSelectors } from "./analysis/slice";
import { STORE_NAME } from "./common/constants";
import editorReducer, { EDITOR_SLICE_NAME, editorActions, editorSelectors } from "./editor/slice";
import formReducer, { FORM_SLICE_NAME, formActions, formSelectors } from "./form/slice";

export { STORE_NAME as SEO_STORE_NAME };

export { useAnalyze } from "./analysis/hooks";

export const actions = {
	...analysisActions,
	...editorActions,
	...formActions,
};

export const selectors = {
	...analysisSelectors,
	...editorSelectors,
	...formSelectors,
};

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

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

const registerSeoStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
} ) => {
	register( createSeoStore( { analyze, preparePaper, processResults } ) );
};

export default registerSeoStore;
