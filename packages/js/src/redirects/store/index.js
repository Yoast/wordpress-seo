// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";

import { STORE_NAME } from "../constants";
import {
	DOCUMENT_TITLE_NAME,
	documentTitleReducer,
	documentTitleSelectors,
	linkParamsSelectors,

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
			...preferencesActions,
		},
		selectors: {
			...documentTitleSelectors,
			...linkParamsSelectors,
			...preferencesSelectors,
		},
		initialState: {
			preferences: createInitialPreferencesState(),
			...initialState,
		},
		reducer: combineReducers( {
			[ DOCUMENT_TITLE_NAME ]: documentTitleReducer,
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
