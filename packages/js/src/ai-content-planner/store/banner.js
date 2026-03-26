import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { setBannerDismissedInput, setBannerRenderedInput } from "../helpers/fields";

export const BANNER_NAME = "banner";

const slice = createSlice( {
	name: BANNER_NAME,
	initialState: {
		isBannerDismissed: false,
		isBannerRendered: false,
	},
	reducers: {
		setBannerRendered: ( state ) => {
			state.isBannerRendered = true;
		},
		setBannerDismissed: ( state ) => {
			state.isBannerDismissed = true;
		},
	},
} );

export const getInitialBannerState = slice.getInitialState;

export const bannerSelectors = {
	getIsBannerDismissed: ( state ) => get( state, [ BANNER_NAME, "isBannerDismissed" ], slice.getInitialState().isBannerDismissed ),
	getIsBannerRendered: ( state ) => get( state, [ BANNER_NAME, "isBannerRendered" ], slice.getInitialState().isBannerRendered ),
};

export const bannerActions = {
	setBannerRendered: () => {
		setBannerRenderedInput();
		return slice.actions.setBannerRendered();
	},
	setBannerDismissed: () => {
		setBannerDismissedInput();
		return slice.actions.setBannerDismissed();
	},
};

export const bannerReducer = slice.reducer;
