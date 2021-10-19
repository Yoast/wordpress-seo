/* eslint-disable require-jsdoc */

import { configureStore } from "@reduxjs/toolkit";
import { identity } from "lodash";

import analysisDataReducer, { analysisDataActions, analysisDataSelectors } from "./analysis-data-slice";
import analysisResultsReducer, { analysisResultsActions, analysisResultsSelectors } from "./analysis-results-slice";
import { createActions, createSelectors } from "./helpers";
import createProvider from "./provider";

export const actions = {
	...analysisDataActions,
	...analysisResultsActions,
};

export const selectors = {
	...analysisDataSelectors,
	...analysisResultsSelectors,
};

const createAnalysisStore = ( {
	fetchSeoResults,
	fetchReadabilityResults,
	fetchResearchResults,
	preparePaper = identity,
	middleware = [],
} ) => {
	const store = configureStore( {
		reducer: {
			analysisData: analysisDataReducer,
			analysisResults: analysisResultsReducer,
		},
		middleware: ( getDefaultMiddleware ) => [
			...getDefaultMiddleware( {
				thunk: {
					extraArgument: {
						preparePaper,
						fetchSeoResults,
						fetchReadabilityResults,
						fetchResearchResults,
					},
				},
			} ),
			...middleware,
		],
	} );

	const Provider = createProvider( store );

	return {
		actions: createActions( store, actions ),
		selectors: createSelectors( store, selectors ),
		Provider,
	};
};

export default createAnalysisStore;
