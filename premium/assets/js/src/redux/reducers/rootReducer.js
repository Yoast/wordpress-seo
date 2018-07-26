import { combineReducers } from "redux";
import SynonymsReducer from "yoast-components/composites/Plugin/Synonyms/reducers/synonyms";
import LinkSuggestionsReducer from "./LinkSuggestions";
import { insightsReducer } from "yoast-premium-components/redux/reducers/insights";

export default combineReducers( {
	synonyms: SynonymsReducer,
	linkSuggestions: LinkSuggestionsReducer,
	insights: insightsReducer,
} );
