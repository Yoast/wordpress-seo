import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { BANNER_NAME, bannerActions, bannerReducer, bannerSelectors, getInitialBannerState } from "./banner";
import { setBannerDismissedInput, setBannerRenderedInput } from "../helpers/fields";

export const STORE_NAME = "yoast-seo/content-planner";

const thunkActions = {
	setBannerRendered: () => ( { dispatch } ) => {
		dispatch( bannerActions.setBannerRendered() );
		setBannerRenderedInput();
	},
	setBannerDismissed: () => ( { dispatch } ) => {
		dispatch( bannerActions.setBannerDismissed() );
		setBannerDismissedInput();
	},
};

const createStore = ( initialState ) => createReduxStore( STORE_NAME, {
	actions: {
		...thunkActions,
	},
	selectors: {
		...bannerSelectors,
	},
	initialState: merge(
		{},
		{ [ BANNER_NAME ]: getInitialBannerState() },
		initialState
	),
	reducer: combineReducers( {
		[ BANNER_NAME ]: bannerReducer,
	} ),
} );

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
export const registerStore = ( initialState = {} ) => {
	register( createStore( initialState ) );
};
