import { combineReducers } from "redux";
import { wordsForInsightsReducer } from "./prominentWords";

export const insightsReducer = combineReducers( {
	prominentWords: wordsForInsightsReducer,
} );
