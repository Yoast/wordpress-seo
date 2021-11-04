import { combineReducers } from "@wordpress/data";
import keyphrasesReducer, { keyphrasesActions, keyphrasesSelectors } from "./keyphrases";
import seoReducer, { seoActions, seoSelectors } from "./seo";

export const FORM_SLICE_NAME = "form";

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
