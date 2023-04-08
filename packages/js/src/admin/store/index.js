// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { STORE_NAME } from "../constants";
import { actions as routesActions, createInitialState as createRoutesState, reducer as routes, selectors as routesSelectors } from "./routes";
import { actions as sharedActions, createInitialState as createSharedState, reducer as shared, selectors as sharedSelectors } from "./shared";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...routesActions,
			...sharedActions,
		},
		selectors: {
			...routesSelectors,
			...sharedSelectors,
		},
		initialState: merge(
			{},
			{
				routes: createRoutesState(),
				shared: createSharedState(),
			},
			initialState
		),
		reducer: combineReducers( {
			routes,
			shared,
		} ),
		controls: {},
	} );
};

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
export const registerStore = ( { initialState = {} } = {} ) => {
	register( createStore( { initialState } ) );
};
