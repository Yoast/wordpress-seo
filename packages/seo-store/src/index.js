import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { STORE_NAME } from "./common/constants";
import { ANALYZE_ACTION_NAME } from "./analysis/constants";
import analysisReducer, { analysisActions, analysisSelectors, initialAnalysisState } from "./analysis/slice";
import editorReducer, { editorActions, editorSelectors, initialEditorState } from "./editor/slice";
import formReducer, { formActions, formSelectors, initialFormState } from "./form/slice";

export { STORE_NAME as SEO_STORE_NAME };

export { useAnalyze } from "./analysis/hooks";

export const defaultInitialState = {
	analysis: initialAnalysisState,
	editor: initialEditorState,
	form: initialFormState,
};

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

export const reducers = {
	analysis: analysisReducer,
	editor: editorReducer,
	form: formReducer,
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
		initialState: merge( {}, defaultInitialState, initialState ),
		reducer: combineReducers( reducers ),
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
