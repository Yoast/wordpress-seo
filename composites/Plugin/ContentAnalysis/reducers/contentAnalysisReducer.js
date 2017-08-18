import { readabilityResultsReducer } from "../reducers/contentAnalysis/readabilityResultsReducer";
import { keywordResultsReducer } from "../reducers/contentAnalysis/keywordResultsReducer";
import { combineReducers } from "redux";

export const contentAnalysisReducer = combineReducers( {
	seo: keywordResultsReducer,
	readability: readabilityResultsReducer,
} );
