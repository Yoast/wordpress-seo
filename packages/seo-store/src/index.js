import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { STORE_NAME, FOCUS_KEYPHRASE_ID, MARKER_STATUS } from "./common/constants";
import { ANALYZE_ACTION_NAME } from "./analysis/constants";
import analysisReducer, { analysisActions, analysisSelectors, defaultAnalysisState } from "./analysis/slice";
import editorReducer, { editorActions, editorSelectors, defaultEditorState } from "./editor/slice";
import formReducer, { formActions, formSelectors, defaultFormState } from "./form/slice";

export { STORE_NAME as SEO_STORE_NAME };
export { FOCUS_KEYPHRASE_ID };
export { MARKER_STATUS };

export { useAnalyze } from "./analysis/hooks";

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
		actions: {
			...analysisActions,
			...editorActions,
			...formActions,
		},
		selectors: {
			...analysisSelectors,
			...editorSelectors,
			...formSelectors,
		},
		initialState: merge(
			{},
			{
				analysis: defaultAnalysisState,
				editor: defaultEditorState,
				form: defaultFormState,
			},
			initialState,
		),
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
