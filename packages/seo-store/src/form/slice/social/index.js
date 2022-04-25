import { combineReducers } from "@reduxjs/toolkit";
import facebookReducer, { facebookActions, facebookSelectors, defaultFacebookState } from "./facebook";
import twitterReducer, { twitterActions, twitterSelectors, defaultTwitterState } from "./twitter";
import socialTemplateReducer, { socialTemplateActions, socialTemplateSelectors, defaultSocialTemplate } from "./template";

export const defaultSocialState = {
	facebook: defaultFacebookState,
	twitter: defaultTwitterState,
	socialTemplate: defaultSocialTemplate,
};

export const socialSelectors = {
	...facebookSelectors,
	...twitterSelectors,
	...socialTemplateSelectors,
};

export const socialActions = {
	...facebookActions,
	...twitterActions,
	...socialTemplateActions,
};

export default combineReducers( {
	facebook: facebookReducer,
	twitter: twitterReducer,
	socialTemplate: socialTemplateReducer,
} );
