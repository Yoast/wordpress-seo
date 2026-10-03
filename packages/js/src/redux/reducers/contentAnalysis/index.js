import { combineReducers } from "@wordpress/data";
import { inclusiveLanguageResultsReducer } from "./inclusiveLanguageResultsReducer";
import { keywordResultsReducer } from "./keywordResultsReducer";
import { readabilityResultsReducer } from "./readabilityResultsReducer";

const contentAnalysisReducer = combineReducers( {
	seo: keywordResultsReducer,
	readability: readabilityResultsReducer,
	inclusiveLanguage: inclusiveLanguageResultsReducer,
} );

export default contentAnalysisReducer;
