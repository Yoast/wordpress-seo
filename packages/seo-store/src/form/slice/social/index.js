import { combineReducers } from "@reduxjs/toolkit";
import facebookReducer, { facebookActions, facebookSelectors, defaultFacebookState } from "./facebook";
import twitterReducer, { twitterActions, twitterSelectors, defaultTwitterState } from "./twitter";

export const defaultSocialState = {
	facebook: defaultFacebookState,
	twitter: defaultTwitterState,
};

export const socialSelectors = {
	...facebookSelectors,
	...twitterSelectors,
};

export const socialActions = {
	...facebookActions,
	...twitterActions,
};

export default combineReducers( {
	facebook: facebookReducer,
	twitter: twitterReducer,
} );
