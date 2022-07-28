import { combineReducers, createReduxStore, register, useSelect } from "@wordpress/data";
import { merge } from "lodash";
import { createInitialLinkParamsState, linkParamsActions, linkParamsSelectors } from "./link-params";
import notifications, { createInitialNotificationsState, notificationsActions, notificationsSelectors } from "./notifications";
import postTypes, { createInitialPostTypesState, postTypesActions, postTypesSelectors } from "./post-types";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import replacementVariables, {
	createInitialReplacementVariablesState,
	replacementVariablesActions,
	replacementVariablesSelectors,
} from "./replacement-variables";
import schema, { createInitialSchemaState, schemaActions, schemaSelectors } from "./schema";
import taxonomies, { createInitialTaxonomiesState, taxonomiesActions, taxonomiesSelectors } from "./taxonomies";

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
			...linkParamsActions,
			...notificationsActions,
			...postTypesActions,
			...preferencesActions,
			...replacementVariablesActions,
			...schemaActions,
			...taxonomiesActions,
		},
		selectors: {
			...linkParamsSelectors,
			...notificationsSelectors,
			...postTypesSelectors,
			...preferencesSelectors,
			...replacementVariablesSelectors,
			...schemaSelectors,
			...taxonomiesSelectors,
		},
		initialState: merge(
			{},
			{
				linkParams: createInitialLinkParamsState(),
				notifications: createInitialNotificationsState(),
				postTypes: createInitialPostTypesState(),
				preferences: createInitialPreferencesState(),
				replacementVariables: createInitialReplacementVariablesState(),
				schema: createInitialSchemaState(),
				taxonomies: createInitialTaxonomiesState(),
			},
			initialState
		),
		reducer: combineReducers( {
			notifications,
			postTypes,
			preferences,
			replacementVariables,
			schema,
			taxonomies,
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
