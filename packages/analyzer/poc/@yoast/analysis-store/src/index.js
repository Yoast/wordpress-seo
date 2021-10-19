/* eslint-disable require-jsdoc */

import { configureStore } from "@reduxjs/toolkit";

import analysisDataReducer, { actions as analysisDataActions, selectors as analysisDataSelectors } from "./analysis-data-slice";
import createProvider from "./provider";

export const actions = {
	...analysisDataActions,
};

export const selectors = {
	...analysisDataSelectors,
};

const createAnalysisStore = ( {
	getSeoResults,
	getReadabilityResults,
	getResearchResults,
	middleware = [],
} ) => {
	const store = configureStore( {
		reducer: {
			analysisData: analysisDataReducer,
		},
		middleware: ( getDefaultMiddleware ) => [
			...getDefaultMiddleware( {
				thunk: {
					extraArgument: {
						getSeoResults,
						getReadabilityResults,
						getResearchResults,
					},
				},
			} ),
			...middleware,
		],
	} );

	const Provider = createProvider( { store } );

	return {
		dispatch: store.dispatch,
		select: ( selector, ...args ) => selector( store.getState(), ...args ),
		Provider,
	};
};

export default createAnalysisStore;
