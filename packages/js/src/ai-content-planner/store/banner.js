import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const BANNER_NAME = "banner";

const slice = createSlice( {
	name: BANNER_NAME,
	initialState: {
		isBannerDismissed: false,
		shouldShowBanner: false,
	},
	reducers: {
		// This should be persisted in post meta, will be addressed in future iterations.
		dismissBanner: ( state ) => {
			state.isBannerDismissed = true;
		},
		// This should be persisted in post meta, will be addressed in future iterations.
		showBanner: ( state ) => {
			state.shouldShowBanner = true;
		},
	},
} );

export const getInitialBannerState = slice.getInitialState;

export const bannerSelectors = {
	getIsBannerDismissed: ( state ) => get( state, [ BANNER_NAME, "isBannerDismissed" ], slice.getInitialState().isBannerDismissed ),
	getShouldShowBanner: ( state ) => get( state, [ BANNER_NAME, "shouldShowBanner" ], slice.getInitialState().shouldShowBanner ),
};

export const bannerActions = {
	...slice.actions,
};

export const bannerReducer = slice.reducer;
