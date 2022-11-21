import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { STORE_NAME } from "../constants";
import { breadcrumbsSelectors } from "./breadcrumbs";
import defaultSettings, { createInitialDefaultSettingsState, defaultSettingsActions, defaultSettingsSelectors } from "./default-settings";
import fallbacks, { createInitialFallbacksState, fallbacksActions, fallbacksSelectors } from "./fallbacks";
import linkParams, { createInitialLinkParamsState, linkParamsActions, linkParamsSelectors } from "./link-params";
import media, { createInitialMediaState, mediaActions, mediaControls, mediaSelectors } from "./media";
import notifications, { createInitialNotificationsState, notificationsActions, notificationsSelectors } from "./notifications";
import postTypes, { createInitialPostTypesState, postTypesActions, postTypesSelectors } from "./post-types";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import replacementVariables, {
	createInitialReplacementVariablesState,
	replacementVariablesActions,
	replacementVariablesSelectors,
} from "./replacement-variables";
import schema, { createInitialSchemaState, schemaActions, schemaSelectors } from "./schema";
import search, { createInitialSearchState, searchActions, searchSelectors } from "./search";
import taxonomies, { createInitialTaxonomiesState, taxonomiesActions, taxonomiesSelectors } from "./taxonomies";
import users, { createInitialUsersState, usersActions, usersControls, usersSelectors } from "./users";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...defaultSettingsActions,
			...fallbacksActions,
			...linkParamsActions,
			...mediaActions,
			...notificationsActions,
			...postTypesActions,
			...preferencesActions,
			...replacementVariablesActions,
			...schemaActions,
			...searchActions,
			...taxonomiesActions,
			...usersActions,
		},
		selectors: {
			...breadcrumbsSelectors,
			...defaultSettingsSelectors,
			...fallbacksSelectors,
			...linkParamsSelectors,
			...mediaSelectors,
			...notificationsSelectors,
			...postTypesSelectors,
			...preferencesSelectors,
			...replacementVariablesSelectors,
			...schemaSelectors,
			...searchSelectors,
			...taxonomiesSelectors,
			...usersSelectors,
		},
		initialState: merge(
			{},
			{
				defaultSettings: createInitialDefaultSettingsState(),
				fallbacks: createInitialFallbacksState(),
				linkParams: createInitialLinkParamsState(),
				media: createInitialMediaState(),
				notifications: createInitialNotificationsState(),
				postTypes: createInitialPostTypesState(),
				preferences: createInitialPreferencesState(),
				replacementVariables: createInitialReplacementVariablesState(),
				schema: createInitialSchemaState(),
				search: createInitialSearchState(),
				taxonomies: createInitialTaxonomiesState(),
				users: createInitialUsersState(),
			},
			initialState
		),
		reducer: combineReducers( {
			defaultSettings,
			fallbacks,
			linkParams,
			media,
			notifications,
			postTypes,
			preferences,
			replacementVariables,
			schema,
			search,
			taxonomies,
			users,
		} ),
		controls: {
			...mediaControls,
			...usersControls,
		},
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
