import { combineReducers } from "redux";
import SynonymsReducer from "yoast-components/composites/Plugin/Synonyms/reducers/synonyms";
import LinkSuggestionsReducer from "./LinkSuggestions";

export default combineReducers( {
	synonyms: SynonymsReducer,
	linkSuggestions: LinkSuggestionsReducer,
} );
