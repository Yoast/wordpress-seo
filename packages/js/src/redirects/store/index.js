// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";

import { STORE_NAME } from "../constants";
import {
	linkParamsSelectors,
	NOTIFICATIONS_NAME,
	notificationsActions,
	notificationsReducer,
	notificationsSelectors,
} from "../../shared-admin/store";
import {
	FILTER_SLICE_NAME,
	filterActions,
	filterSelectors,
	getInitialFilterState,
	filterReducer,
} from "./filter-redirects";
import redirects, { createInitialRedirectsState, redirectsActions, redirectsControls, redirectsSelectors } from "./redirects";


/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...filterActions,
			...notificationsActions,
			...redirectsActions,
		},
		selectors: {
			...linkParamsSelectors,
			...filterSelectors,
			...notificationsSelectors,
			...redirectsSelectors,
		},
		initialState: {
			[ FILTER_SLICE_NAME ]: getInitialFilterState(),
			redirects: createInitialRedirectsState(),
			...initialState,
		},
		reducer: combineReducers( {
			[ FILTER_SLICE_NAME ]: filterReducer,
			[ NOTIFICATIONS_NAME ]: notificationsReducer,
			redirects,
		} ),
		controls: {
			...redirectsControls,
		},
	} );
};

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
const registerStore = ( { initialState = {} } = {} ) => {
	register( createStore( { initialState } ) );
};

export default registerStore;
