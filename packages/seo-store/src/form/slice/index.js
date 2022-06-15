import { combineReducers } from "@wordpress/data";
import seoReducer, { seoActions, seoSelectors, defaultSeoState } from "./seo";
import keyphrasesReducer, { keyphrasesActions, keyphrasesSelectors, defaultKeyphrasesState } from "./keyphrases";
import socialReducer, { socialActions, socialSelectors, defaultSocialState } from "./social";
import templateReducer, { templateActions, templateSelectors, defaultTemplateState } from "./template";

export const defaultFormState = {
	seo: defaultSeoState,
	keyphrases: defaultKeyphrasesState,
	social: defaultSocialState,
	template: defaultTemplateState,
};

export const formSelectors = {
	...seoSelectors,
	...keyphrasesSelectors,
	...socialSelectors,
	...templateSelectors,
};

export const formActions = {
	...seoActions,
	...keyphrasesActions,
	...socialActions,
	...templateActions,
};

export default combineReducers( {
	seo: seoReducer,
	keyphrases: keyphrasesReducer,
	social: socialReducer,
	template: templateReducer,
} );
