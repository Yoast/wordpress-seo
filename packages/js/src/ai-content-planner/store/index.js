import { combineReducers, createReduxStore } from "@wordpress/data";
import { BANNER_NAME, bannerActions, bannerReducer, bannerSelectors, getInitialBannerState } from "./banner";

export const STORE_NAME = "yoast-seo/post-planner";

export const store = createReduxStore( STORE_NAME, {
	actions: {
		...bannerActions,
	},
	selectors: {
		...bannerSelectors,
	},
	initialState: {
		[ BANNER_NAME ]: getInitialBannerState(),
	},
	reducer: combineReducers( {
		[ BANNER_NAME ]: bannerReducer,
	} ),
} );
