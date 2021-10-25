import { identity } from "lodash";
import { createReduxStore, register } from "@wordpress/data";

// Import {createActions, createSelectors} from "./helpers";
// Import createProvider from "./provider";
//
// Import analysisDataReducer, {analysisDataActions, analysisDataSelectors} from "./analysis-data-slice";
// Import analysisResultsReducer, {analysisResultsActions, analysisResultsSelectors} from "./analysis-results-slice";

// Export const actions = {
// 	...analysisDataActions,
// 	...analysisResultsActions,
// };
//
// Export const selectors = {
// 	...analysisDataSelectors,
// 	...analysisResultsSelectors,
// };

const createAnalysisStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
} ) => {
	const store = createReduxStore( {
		reducer: {
			// analysisData: analysisDataReducer,
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
