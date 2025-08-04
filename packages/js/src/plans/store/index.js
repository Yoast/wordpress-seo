import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { getInitialLinkParamsState, LINK_PARAMS_NAME, linkParamsActions, linkParamsReducer, linkParamsSelectors } from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import { ADD_ONS_NAME, addOnsActions, addOnsReducer, addOnsSelectors, getInitialAddOnsState } from "./add-ons";
import { getInitialPreferencesState, PREFERENCES_NAME, preferencesActions, preferencesReducer, preferencesSelectors } from "./preferences";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...addOnsActions,
			...linkParamsActions,
			...preferencesActions,
		},
		selectors: {
			...addOnsSelectors,
			...linkParamsSelectors,
			...preferencesSelectors,
		},
		initialState: merge(
			{},
			{
				[ ADD_ONS_NAME ]: getInitialAddOnsState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ PREFERENCES_NAME ]: getInitialPreferencesState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ ADD_ONS_NAME ]: addOnsReducer,
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

// Re-export the names of the registered store slices.
export {
	ADD_ONS_NAME,
	LINK_PARAMS_NAME,
	PREFERENCES_NAME,
};
