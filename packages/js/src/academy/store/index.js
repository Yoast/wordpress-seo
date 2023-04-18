// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { STORE_NAME } from "../constants";
import linkParams, { createInitialLinkParamsState, linkParamsActions, linkParamsSelectors } from "./link-params";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...linkParamsActions,
			...preferencesActions,
		},
		selectors: {
			...linkParamsSelectors,
			...preferencesSelectors,
		},
		initialState: merge(
			{},
			{
				linkParams: createInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
			},
			initialState
		),
		reducer: combineReducers( {
			linkParams,
			preferences,
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
