import { createReduxStore, createRegistry } from "@wordpress/data";
import { identity } from "lodash";
import { STORE_NAME } from "./constants";
import { createActions, createSelectors } from "./helpers";
import createProvider from "./provider";
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

export { default as useAnalyze } from "./hooks/use-analyze";
export { STORE_NAME };

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

const createAnalysisStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
	registry = createRegistry(),
} ) => {
	const store = createReduxStore( STORE_NAME, {
		reducer: {
			[ CONFIG_SLICE_NAME ]: configReducer,
			[ DATA_SLICE_NAME ]: dataReducer,
			[ KEYPHRASES_SLICE_NAME ]: keyphrasesReducer,
			[ RESULTS_SLICE_NAME ]: resultsReducer,
		},
		controls: {
			[ ANALYZE_ACTION_NAME ]: async ( { payload: { paper, targets, config } } ) => analyze( paper, targets, config ),
			[ PREPARE_PAPER_ACTION_NAME ]: async ( { payload } ) => preparePaper( payload ),
			[ PROCESS_RESULTS_ACTION_NAME ]: async ( { payload } ) => processResults( payload ),
		},
	} );
	registry.register( store );

	const Provider = createProvider( registry );

	return {
		actions: createActions( store, actions ),
		selectors: createSelectors( store, selectors ),
		Provider,
		store,
	};
};

export default createAnalysisStore;
