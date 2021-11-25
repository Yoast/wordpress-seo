import { combineReducers } from "@wordpress/data";
import seoReducer, { seoActions, seoSelectors, defaultSeoState } from "./seo";
import keyphrasesReducer, { keyphrasesActions, keyphrasesSelectors, defaultKeyphrasesState } from "./keyphrases";

export const defaultFormState = {
	seo: defaultSeoState,
	keyphrases: defaultKeyphrasesState,
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
