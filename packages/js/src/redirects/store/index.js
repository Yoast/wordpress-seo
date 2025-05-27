// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";

import { STORE_NAME } from "../constants";
import { linkParamsSelectors } from "../../shared-admin/store";
import {
	FILTER_SLICE_NAME,
	filterActions,
	filterSelectors,
	getInitialFilterState,
	filterReducer,
} from "./filter-redirects";


/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...filterActions,
		},
		selectors: {
			...linkParamsSelectors,
			...filterSelectors,
		},
		initialState: {
			[ FILTER_SLICE_NAME ]: getInitialFilterState(),
			...initialState,
		},
		reducer: combineReducers( {
			[ FILTER_SLICE_NAME ]: filterReducer,
		} ),
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
