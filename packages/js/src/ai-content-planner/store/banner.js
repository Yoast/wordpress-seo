import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { setBannerDismissedInput, setBannerRenderedInput } from "../helpers/fields";

export const BANNER_NAME = "banner";

const slice = createSlice( {
	name: BANNER_NAME,
	initialState: {
		isBannerDismissed: false,
		isBannerRendered: false,
		isBannerPermanentlyDismissed: false,
	},
	reducers: {
		setBannerRendered: ( state ) => {
			state.isBannerRendered = true;
		},
		setBannerDismissed: ( state ) => {
			state.isBannerDismissed = true;
		},
		setBannerPermanentlyDismissed: ( state ) => {
			state.isBannerPermanentlyDismissed = true;
		},
	},
} );

export const getInitialBannerState = slice.getInitialState;

export const bannerReducer = slice.reducer;

/**
 * Public banner actions wrap the slice actions so that dispatching them
 * also writes the matching value to the hidden meta input. The metabox
 * save pipeline then persists "1" to post meta on the next save.
 */
export const bannerActions = {
	setBannerRendered: () => {
		setBannerRenderedInput();
		return slice.actions.setBannerRendered();
	},
	setBannerDismissed: () => {
		setBannerDismissedInput();
		return slice.actions.setBannerDismissed();
	},
	setBannerPermanentlyDismissed: () => slice.actions.setBannerPermanentlyDismissed(),
};

export const bannerSelectors = {
	selectIsBannerDismissed: ( state ) => get( state, [ BANNER_NAME, "isBannerDismissed" ], slice.getInitialState().isBannerDismissed ),
	selectIsBannerRendered: ( state ) => get( state, [ BANNER_NAME, "isBannerRendered" ], slice.getInitialState().isBannerRendered ),
	selectIsBannerPermanentlyDismissed: ( state ) => get( state, [ BANNER_NAME, "isBannerPermanentlyDismissed" ], slice.getInitialState().isBannerPermanentlyDismissed ),
};
