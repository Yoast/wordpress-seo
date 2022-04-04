import { combineReducers } from "@reduxjs/toolkit";
import facebookReducer, { facebookActions, facebookSelectors, defaultFacebookState } from "./facebook";

export const defaultSocialState = {
	facebook: defaultFacebookState,
};

export const socialSelectors = {
	...facebookSelectors,
};

export const socialActions = {
	...facebookActions,
};

export default combineReducers( {
	facebook: facebookReducer,
} );
