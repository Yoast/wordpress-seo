import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { CONTENT_PLANNER_STORE } from "../constants";
import {
	CONTENT_SUGGESTIONS_NAME,
	contentSuggestionsActions,
	contentSuggestionsControls,
	contentSuggestionsReducer,
	contentSuggestionsSelectors,
	getInitialContentSuggestionsState,
} from "./content-suggestions";
import {
	CONTENT_OUTLINE_NAME,
	contentOutlineActions,
	contentOutlineControls,
	contentOutlineReducer,
	contentOutlineSelectors,
	getInitialContentOutlineState,
} from "./content-outline";
import {
	MODAL_NAME,
	modalActions,
	modalReducer,
	modalSelectors,
	getInitialModalState,
} from "./modal";
import {
	AVAILABILITY_NAME,
	availabilityActions,
	availabilityReducer,
	availabilitySelectors,
	getInitialAvailabilityState,
} from "./availability";
import {
	BANNER_NAME,
	bannerActions,
	bannerReducer,
	bannerSelectors,
	getInitialBannerState,
} from "./banner";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
export const createStore = ( initialState ) => {
	return createReduxStore( CONTENT_PLANNER_STORE, {
		actions: {
			...contentSuggestionsActions,
			...contentOutlineActions,
			...modalActions,
			...availabilityActions,
			...bannerActions,
		},
		selectors: {
			...contentSuggestionsSelectors,
			...contentOutlineSelectors,
			...modalSelectors,
			...availabilitySelectors,
			...bannerSelectors,
		},
		controls: {
			...contentSuggestionsControls,
			...contentOutlineControls,
		},
		initialState: merge(
			{},
			{
				[ CONTENT_SUGGESTIONS_NAME ]: getInitialContentSuggestionsState(),
				[ CONTENT_OUTLINE_NAME ]: getInitialContentOutlineState(),
				[ MODAL_NAME ]: getInitialModalState(),
				[ AVAILABILITY_NAME ]: getInitialAvailabilityState(),
				[ BANNER_NAME ]: getInitialBannerState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ CONTENT_SUGGESTIONS_NAME ]: contentSuggestionsReducer,
			[ CONTENT_OUTLINE_NAME ]: contentOutlineReducer,
			[ MODAL_NAME ]: modalReducer,
			[ AVAILABILITY_NAME ]: availabilityReducer,
			[ BANNER_NAME ]: bannerReducer,
		} ),
	} );
};

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
export const registerStore = ( initialState = {} ) => {
	register( createStore( initialState ) );
};
