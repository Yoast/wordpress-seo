import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { getInitialLinkParamsState, LINK_PARAMS_NAME, linkParamsActions, linkParamsReducer, linkParamsSelectors } from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import activeContentType, { activeContentTypeActions, activeContentTypeSelectors, createInitialActiveContentTypeState } from "./active-content-type";
import activeFieldSet, { activeFieldSetActions, activeFieldSetSelectors, createInitialActiveFieldSetState } from "./active-field-set";
import edits, { createInitialEditsState, editsActions, editsSelectors } from "./edits";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import query, { createInitialQueryState, queryActions, querySelectors } from "./query";

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
			...queryActions,
			...editsActions,
		},
		selectors: {
			...linkParamsSelectors,
			...preferencesSelectors,
			...activeFieldSetSelectors,
			...activeContentTypeSelectors,
			...querySelectors,
			...editsSelectors,
		},
		initialState: merge(
			{},
			{
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
				activeFieldSet: createInitialActiveFieldSetState(),
				activeContentType: createInitialActiveContentTypeState(),
				query: createInitialQueryState(),
				edits: createInitialEditsState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			preferences,
			activeFieldSet,
			activeContentType,
			query,
			edits,
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
