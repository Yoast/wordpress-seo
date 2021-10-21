import {configureStore} from "@reduxjs/toolkit";
import {identity} from "lodash";
import {register} from "@wordpress/data";

// import {createActions, createSelectors} from "./helpers";
// import createProvider from "./provider";
//
// import analysisDataReducer, {analysisDataActions, analysisDataSelectors} from "./analysis-data-slice";
// import analysisResultsReducer, {analysisResultsActions, analysisResultsSelectors} from "./analysis-results-slice";

// export const actions = {
// 	...analysisDataActions,
// 	...analysisResultsActions,
// };
//
// export const selectors = {
// 	...analysisDataSelectors,
// 	...analysisResultsSelectors,
// };

const createAnalysisStore = ({
								 analyze,
								 preparePaper = identity,
								 processResults = identity,
							 }) => {
	const store = configureStore({
		reducer: {
			// analysisData: analysisDataReducer,
			// analysisResults: analysisResultsReducer,
		},
	});
	register(store);

	// const Provider = createProvider(store);

	return {
		// actions: createActions(store, actions),
		// selectors: createSelectors(store, selectors),
		// Provider,
	};
};

export default createAnalysisStore;
