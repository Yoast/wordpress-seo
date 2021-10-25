/* eslint-disable require-jsdoc */

import { configureStore } from "@reduxjs/toolkit";
import { identity } from "lodash";

import { createActions, createSelectors } from "./helpers";
import createProvider from "./provider";

import analysisDataReducer, { analysisDataActions, analysisDataSelectors } from "./analysis-data-slice";
import analysisResultsReducer, { analysisResultsActions, analysisResultsSelectors } from "./analysis-results-slice";

export const actions = {
	...analysisDataActions,
	...analysisResultsActions,
};

export const selectors = {
	...analysisDataSelectors,
	...analysisResultsSelectors,
};

const createAnalysisStore = ( {
	analyze,
	preparePaper = identity,
	processResults = identity,
	middleware = [],
} ) => {
	const store = configureStore( {
		reducer: {
			analysisData: analysisDataReducer,
			analysisResults: analysisResultsReducer,
		},
		middleware: ( getDefaultMiddleware ) => ( [
			...getDefaultMiddleware( {
				thunk: {
					extraArgument: {
						preparePaper,
						processResults,
						analyze,
					},
				},
			} ),
			...middleware,
		] ),
	} );

	const Provider = createProvider( store );

	return {
		actions: createActions( store, actions ),
		selectors: createSelectors( store, selectors ),
		Provider,
	};
};

export default createAnalysisStore;
