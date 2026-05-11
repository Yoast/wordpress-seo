import apiFetch from "@wordpress/api-fetch";
import { createSlice } from "@reduxjs/toolkit";
import { get, noop } from "lodash";
import { setBannerDismissedInput, setBannerRenderedInput } from "../helpers/fields";

export const BANNER_NAME = "banner";
const DISMISS_BANNER_PERMANENTLY = "dismissBannerPermanently";

const slice = createSlice( {
	name: BANNER_NAME,
	initialState: {
		isBannerDismissed: false,
		isBannerRendered: false,
		isBannerPermanentlyDismissed: false,
		bannerPermanentDismissalEndpoint: "",
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
 * Marks the banner as permanently dismissed and fires a fire-and-forget
 * REST POST to persist the dismissal in user meta.
 *
 * @param {string} endpoint The REST endpoint path.
 * @returns {Generator}
 */
export function* dismissBannerPermanently( endpoint ) {
	if ( ! endpoint ) {
		return;
	}
	yield slice.actions.setBannerPermanentlyDismissed();
	yield{ type: DISMISS_BANNER_PERMANENTLY, endpoint };
}

export const bannerControls = {
	[ DISMISS_BANNER_PERMANENTLY ]: ( { endpoint } ) => apiFetch( {
		path: endpoint,
		method: "POST",
		// eslint-disable-next-line camelcase
		data: { is_dismissed: true },
	} ).catch( noop ),
};

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
	dismissBannerPermanently,
};

export const bannerSelectors = {
	selectIsBannerDismissed: ( state ) => get( state, [ BANNER_NAME, "isBannerDismissed" ], slice.getInitialState().isBannerDismissed ),
	selectIsBannerRendered: ( state ) => get( state, [ BANNER_NAME, "isBannerRendered" ], slice.getInitialState().isBannerRendered ),
	selectIsBannerPermanentlyDismissed: ( state ) => get( state, [ BANNER_NAME, "isBannerPermanentlyDismissed" ], slice.getInitialState().isBannerPermanentlyDismissed ),
	selectBannerPermanentDismissalEndpoint: ( state ) => get( state, [ BANNER_NAME, "bannerPermanentDismissalEndpoint" ], slice.getInitialState().bannerPermanentDismissalEndpoint ),
};
