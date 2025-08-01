// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";

import { STORE_NAME } from "../constants";
import {
	DOCUMENT_TITLE_NAME,
	documentTitleReducer,
	documentTitleSelectors,
	linkParamsSelectors,
	linkParamsReducer,
	linkParamsActions,
	LINK_PARAMS_NAME,
} from "../../shared-admin/store";
import preferences, { preferencesActions, preferencesSelectors, PREFERENCES_NAME } from "./preferences";


/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...preferencesActions,
			...linkParamsActions,
		},
		selectors: {
			...documentTitleSelectors,
			...linkParamsSelectors,
			...preferencesSelectors,
		},
		initialState: {
			...initialState,
		},
		reducer: combineReducers( {
			[ PREFERENCES_NAME ]: preferences,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ DOCUMENT_TITLE_NAME ]: documentTitleReducer,
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
