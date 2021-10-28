import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { identity } from "lodash";
import { STORE_NAME } from "./constants";
import configReducer, { CONFIG_SLICE_NAME, configActions, configSelectors } from "./slices/config";
import dataReducer, { DATA_SLICE_NAME, dataActions, dataSelectors } from "./slices/data";
import keyphrasesReducer, { KEYPHRASES_SLICE_NAME, keyphrasesActions, keyphrasesSelectors } from "./slices/keyphrases";
import resultsReducer, {
	ANALYZE_ACTION_NAME,
	PREPARE_PAPER_ACTION_NAME,
	PROCESS_RESULTS_ACTION_NAME,
	RESULTS_SLICE_NAME,
	resultsActions,
	resultsSelectors,
} from "./slices/results";

export { STORE_NAME as ANALYSIS_STORE_NAME };

export { default as useAnalyze } from "./hooks/use-analyze";

export const actions = {
	...dataActions,
	...keyphrasesActions,
	...configActions,
	...resultsActions,
};

export const selectors = {
	...dataSelectors,
	...keyphrasesSelectors,
	...configSelectors,
	...resultsSelectors,
};

/**
 * Creates a WP data store for managing analysis data, keyphrases and analysis results.
 *
 * @param {AnalysisStoreConfig} config The configuration object.
 * @returns {WPDataStore} The WP data store.
 */
export const createAnalysisStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
} ) => {
	return createReduxStore( STORE_NAME, {
		actions,
		selectors,
		reducer: combineReducers( {
			[ CONFIG_SLICE_NAME ]: configReducer,
			[ DATA_SLICE_NAME ]: dataReducer,
			[ KEYPHRASES_SLICE_NAME ]: keyphrasesReducer,
			[ RESULTS_SLICE_NAME ]: resultsReducer,
		} ),
		controls: {
			[ ANALYZE_ACTION_NAME ]: async ( { payload: { paper, targets, config } } ) => analyze( paper, targets, config ),
			[ PREPARE_PAPER_ACTION_NAME ]: async ( { payload } ) => preparePaper( payload ),
			[ PROCESS_RESULTS_ACTION_NAME ]: async ( { payload } ) => processResults( payload ),
		},
	} );
};

const registerAnalysisStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
} ) => {
	register( createAnalysisStore( { analyze, preparePaper, processResults } ) );
};

export default registerAnalysisStore;
