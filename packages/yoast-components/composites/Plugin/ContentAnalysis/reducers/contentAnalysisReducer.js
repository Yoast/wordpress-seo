import { readabilityResultsReducer } from "./contentAnalysis/readabilityResultsReducer";
import { keywordResultsReducer } from "./contentAnalysis/keywordResultsReducer";
import { inclusiveLanguageResultsReducer } from "./contentAnalysis/inclusiveLanguageResultsReducer";
import { combineReducers } from "redux";

export default combineReducers( {
	seo: keywordResultsReducer,
	readability: readabilityResultsReducer,
	inclusiveLanguage: inclusiveLanguageResultsReducer,
} );
