import { combineReducers } from "redux";
import { prominentWordsReducer } from "./prominentWords";

export const insightsReducer = combineReducers( {
	prominentWords: prominentWordsReducer,
} );
