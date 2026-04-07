import { combineReducers, createReduxStore } from "@wordpress/data";
import { BANNER_NAME, bannerActions, bannerReducer, bannerSelectors, getInitialBannerState } from "./banner";
import {
	SUGGESTIONS_NAME,
	getInitialSuggestionsState,
	suggestionsActions,
	suggestionsControls,
	suggestionsReducer,
	suggestionsSelectors,
} from "./suggestions";

export const STORE_NAME = "yoast-seo/post-planner";

export const store = createReduxStore( STORE_NAME, {
	actions: {
		...bannerActions,
		...suggestionsActions,
	},
	selectors: {
		...bannerSelectors,
		...suggestionsSelectors,
	},
	initialState: {
		[ BANNER_NAME ]: getInitialBannerState(),
		[ SUGGESTIONS_NAME ]: getInitialSuggestionsState(),
	},
	reducer: combineReducers( {
		[ BANNER_NAME ]: bannerReducer,
		[ SUGGESTIONS_NAME ]: suggestionsReducer,
	} ),
	controls: {
		...suggestionsControls,
	},
} );
