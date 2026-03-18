import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const BANNER_NAME = "banner";

const slice = createSlice( {
	name: BANNER_NAME,
	initialState: {
		isBannerDismissed: false,
	},
	reducers: {
		dismissBanner: ( state ) => {
			state.isBannerDismissed = true;
		},
	},
} );

export const getInitialBannerState = slice.getInitialState;

export const bannerSelectors = {
	getIsBannerDismissed: ( state ) => get( state, [ BANNER_NAME, "isBannerDismissed" ], slice.getInitialState().isBannerDismissed ),
};

export const bannerActions = {
	...slice.actions,
};

export const bannerReducer = slice.reducer;
