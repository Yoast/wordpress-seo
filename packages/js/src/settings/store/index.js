import { combineReducers, createReduxStore, register, useSelect } from "@wordpress/data";
import { merge } from "lodash";
import postTypes, { createInitialPostTypesState, postTypesActions, postTypesSelectors } from "./post-types";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import replacementVariables, {
	createInitialReplacementVariablesState,
	replacementVariablesActions,
	replacementVariablesSelectors,
} from "./replacement-variables";
import  notifications, { notificationsActions, notificationsSelectors } from "./notifications";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

export const STORE_NAME = "@yoast/settings";

/**
 * @param {string} selector The name of the selector.
 * @param {array} [deps] List of dependencies.
 * @param {*} [args] Selector arguments.
 * @returns {*} The result.
 */
export const useSelectSettings = ( selector, deps = [], ...args ) => useSelect( select => select( STORE_NAME )[ selector ]?.( ...args ), deps );

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...notificationsActions,
			...postTypesActions,
			...preferencesActions,
			...replacementVariablesActions,
		},
		selectors: {
			...notificationsSelectors,
			...postTypesSelectors,
			...preferencesSelectors,
			...replacementVariablesSelectors,
		},
		initialState: merge(
			{},
			{
				postTypes: createInitialPostTypesState(),
				preferences: createInitialPreferencesState(),
				replacementVariables: createInitialReplacementVariablesState(),
			},
			initialState
		),
		reducer: combineReducers( {
			notifications,
			postTypes,
			preferences,
			replacementVariables,
		} ),
		controls: {},
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
