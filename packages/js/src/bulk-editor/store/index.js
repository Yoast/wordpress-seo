import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { getInitialLinkParamsState, LINK_PARAMS_NAME, linkParamsActions, linkParamsReducer, linkParamsSelectors } from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import activeContentType, { activeContentTypeActions, activeContentTypeSelectors, createInitialActiveContentTypeState } from "./active-content-type";
import activeFieldSet, { activeFieldSetActions, activeFieldSetSelectors, createInitialActiveFieldSetState } from "./active-field-set";
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
			...activeFieldSetActions,
			...activeContentTypeActions,
		},
		selectors: {
			...linkParamsSelectors,
			...preferencesSelectors,
			...activeFieldSetSelectors,
			...activeContentTypeSelectors,
		},
		initialState: merge(
			{},
			{
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
				activeFieldSet: createInitialActiveFieldSetState(),
				activeContentType: createInitialActiveContentTypeState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			preferences,
			activeFieldSet,
			activeContentType,
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
