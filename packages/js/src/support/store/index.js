// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { getInitialLinkParamsState, LINK_PARAMS_NAME, linkParamsActions, linkParamsReducer, linkParamsSelectors } from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import { getInitialPreferencesState, PREFERENCES_NAME, preferencesActions, preferencesReducer, preferencesSelectors } from "./preferences";

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
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ PREFERENCES_NAME ]: getInitialPreferencesState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ PREFERENCES_NAME ]: preferencesReducer,
		} ),

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
