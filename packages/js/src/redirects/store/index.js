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
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";


/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...notificationsActions,
			...preferencesActions,
		},
		selectors: {
			...linkParamsSelectors,
			...notificationsSelectors,
			...preferencesSelectors,
		},
		initialState: {
			preferences: createInitialPreferencesState(),
			...initialState,
		},
		reducer: combineReducers( {
			[ NOTIFICATIONS_NAME ]: notificationsReducer,
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
