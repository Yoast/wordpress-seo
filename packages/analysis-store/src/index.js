import { createReduxStore } from "@wordpress/data";
import { identity } from "lodash";
import { createActions, createSelectors } from "./helpers";
import createProvider from "./provider";
import configReducer, { CONFIG_SLICE_NAME, configActions, configSelectors } from "./slices/config";
import dataReducer, { DATA_SLICE_NAME, dataActions, dataSelectors } from "./slices/data";
import resultsReducer, {
	ANALYZE_ACTION_NAME,
	PREPARE_PAPER_ACTION_NAME,
	PROCESS_RESULTS_ACTION_NAME,
	RESULTS_SLICE_NAME,
	resultsActions,
	resultsSelectors,
} from "./slices/results";
import targetsReducer, { TARGETS_SLICE_NAME, targetsActions, targetsSelectors } from "./slices/targets";

const STORE_NAME = "@yoast/analysis-store";

export const actions = {
	...dataActions,
	...targetsActions,
	...configActions,
	...resultsActions,
};

export const selectors = {
	...dataSelectors,
	...targetsSelectors,
	...configSelectors,
	...resultsSelectors,
};

const createAnalysisStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
} ) => {
	const store = createReduxStore( STORE_NAME, {
		reducer: {
			[ CONFIG_SLICE_NAME ]: configReducer,
			[ DATA_SLICE_NAME ]: dataReducer,
			[ TARGETS_SLICE_NAME ]: targetsReducer,
			[ RESULTS_SLICE_NAME ]: resultsReducer,
		},
		controls: {
			[ ANALYZE_ACTION_NAME ]: async ( { payload: { paper, targets, config } } ) => analyze( paper, targets, config ),
			[ PREPARE_PAPER_ACTION_NAME ]: async ( { payload } ) => preparePaper( payload ),
			[ PROCESS_RESULTS_ACTION_NAME ]: async ( { payload } ) => processResults( payload ),
		},
	} );

	const Provider = createProvider( store );

	return {
		actions: createActions( store, actions ),
		selectors: createSelectors( store, selectors ),
		Provider,
		store,
	};
};

export default createAnalysisStore;
