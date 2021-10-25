import { createReduxStore, register } from "@wordpress/data";
import { identity } from "lodash";
import { resultsActions, resultsSelectors } from "./slices/results";
import dataReducer, { DATA_SLICE_NAME, dataActions, dataSelectors } from "./slices/data";

export const actions = {
	...dataActions,
	...resultsActions,
};

export const selectors = {
	...dataSelectors,
	...resultsSelectors,
};

const createAnalysisStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
} ) => {
	const store = createReduxStore( {
		reducer: {
			[ DATA_SLICE_NAME ]: dataReducer,
			// analysisResults: analysisResultsReducer,
		},
	} );
	register( store );

	// Const Provider = createProvider(store);

	return {
		// Actions: createActions(store, actions),
		// Selectors: createSelectors(store, selectors),
		// Provider,
	};
};

export default createAnalysisStore;
