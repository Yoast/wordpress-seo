import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { BANNER_NAME, bannerActions, bannerReducer, bannerSelectors, getInitialBannerState } from "./banner";
import { setBannerDismissedInput, setBannerRenderedInput } from "../helpers/fields";

export const STORE_NAME = "yoast-seo/content-planner";

const persistBannerMiddleware = () => ( next ) => ( action ) => {
	const result = next( action );
	if ( action.type === `${ BANNER_NAME }/setBannerRendered` ) {
		setBannerRenderedInput();
	} else if ( action.type === `${ BANNER_NAME }/setBannerDismissed` ) {
		setBannerDismissedInput();
	}
	return result;
};

const createStore = ( initialState ) => createReduxStore( STORE_NAME, {
	actions: {
		...bannerActions,
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
	middleware: ( getDefaultMiddleware ) => [
		...getDefaultMiddleware(),
		persistBannerMiddleware,
	],
} );

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
export const registerStore = ( initialState = {} ) => {
	register( createStore( initialState ) );
};
