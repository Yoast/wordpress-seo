import { readabilityResultsReducer } from "../reducers/contentAnalysis/readabilityResultsReducer";
import { keywordResultsReducer } from "../reducers/contentAnalysis/keywordResultsReducer";
// import { overallScoreReducer } from "../reducers/contentAnalysis/overallScoreReducer";
import { combineReducers } from "redux";

export default combineReducers( {
	seo: keywordResultsReducer,
	readability: readabilityResultsReducer,
	overallScore: overallScoreReducer,
} );
