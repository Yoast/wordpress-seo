import { combineReducers, createReduxStore, register } from "@wordpress/data";

import { STORE_NAME } from "./common/constants";

import analysisReducer, { analysisActions, analysisSelectors } from "./analysis/slice";
import editorReducer, { editorActions, editorSelectors } from "./editor/slice";
import formReducer, { formActions, formSelectors } from "./form/slice";
import { ANALYZE_ACTION_NAME } from "./analysis/slice/results";

export { STORE_NAME as SEO_STORE_NAME };

export { ANALYSIS_RATINGS } from "./common/constants";
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
 * @param {Object} initialState Initial state.
 * @param {function} analyze Runs an analysis.
 *
 * @returns {WPDataStore} The WP data store.
 */
const createSeoStore = ( { initialState, analyze } ) => {
	return createReduxStore( STORE_NAME, {
		actions,
		selectors,
		initialState,
		reducer: combineReducers( {
			analysis: analysisReducer,
			editor: editorReducer,
			form: formReducer,
		} ),
		controls: {
			[ ANALYZE_ACTION_NAME ]: async ( { payload: { paper, keyphrases, config } } ) => analyze( paper, keyphrases, config ),
		},
	} );
};

/**
 * Registers the SEO store to WP data's default registry.
 *
 * @param {Object} [initialState] Initial state.
 * @param {function} analyze Runs an analysis.
 *
 * @returns {void}
 */
const registerSeoStore = ( { initialState = {}, analyze } = {} ) => {
	register( createSeoStore( { initialState, analyze } ) );
};

export default registerSeoStore;
