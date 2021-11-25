import { combineReducers } from "@wordpress/data";
import seoReducer, { seoActions, seoSelectors, initialSeoState } from "./seo";
import keyphrasesReducer, { keyphrasesActions, keyphrasesSelectors, initialKeyphrasesState } from "./keyphrases";

export const initialFormState = {
	seo: initialSeoState,
	keyphrases: initialKeyphrasesState,
};

export const formSelectors = {
	...seoSelectors,
	...keyphrasesSelectors,
};

export const formActions = {
	...seoActions,
	...keyphrasesActions,
};

export default combineReducers( {
	seo: seoReducer,
	keyphrases: keyphrasesReducer,
} );
