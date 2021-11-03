import { combineReducers } from "@wordpress/data";
import configReducer, { keyphrasesActions, keyphrasesSelectors } from "./config";
import resultsReducer, { seoActions, seoSelectors } from "./results";

export const ANALYSIS_SLICE_NAME = "analysis";

export const analysisSelectors = {
	...seoSelectors,
	...keyphrasesSelectors,
};

export const analysisActions = {
	...seoActions,
	...keyphrasesActions,
};

export default combineReducers( {
	config: configReducer,
	results: resultsReducer,
} );
