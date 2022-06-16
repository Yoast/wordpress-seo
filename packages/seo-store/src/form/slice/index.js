import { combineReducers } from "@wordpress/data";
import seoReducer, { seoActions, seoSelectors, defaultSeoState } from "./seo";
import keyphrasesReducer, { keyphrasesActions, keyphrasesSelectors, defaultKeyphrasesState } from "./keyphrases";
import socialReducer, { socialActions, socialSelectors, defaultSocialState } from "./social";

export const defaultFormState = {
	seo: defaultSeoState,
	keyphrases: defaultKeyphrasesState,
	social: defaultSocialState,
};

export const formSelectors = {
	...seoSelectors,
	...keyphrasesSelectors,
	...socialSelectors,
};

export const formActions = {
	...seoActions,
	...keyphrasesActions,
	...socialActions,
};

export default combineReducers( {
	seo: seoReducer,
	keyphrases: keyphrasesReducer,
	social: socialReducer,
} );
