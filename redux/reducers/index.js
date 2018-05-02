import { combineReducers } from "redux";

import { insightsReducer } from "./insights";
import { linkSuggestionsReducer } from "./linkSuggestions";

export default combineReducers( {
	insights: insightsReducer,
	linkSuggestions: linkSuggestionsReducer,
} );
