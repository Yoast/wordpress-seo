import { combineReducers } from "redux";
import SynonymsReducer from "yoast-components/composites/Plugin/Synonyms/reducers/synonyms";

export default combineReducers( {
	synonyms: SynonymsReducer,
} );
