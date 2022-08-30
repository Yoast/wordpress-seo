import { readabilityResultsReducer } from "./contentAnalysis/readabilityResultsReducer";
import { keywordResultsReducer } from "./contentAnalysis/keywordResultsReducer";
import { combineReducers } from "redux";

export default combineReducers( {
	seo: keywordResultsReducer,
	readability: readabilityResultsReducer,
} );
