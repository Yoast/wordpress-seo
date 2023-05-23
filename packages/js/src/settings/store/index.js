// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { STORE_NAME } from "../constants";
import { breadcrumbsSelectors } from "./breadcrumbs";
import defaultSettingValues, {
	createInitialDefaultSettingValuesState,
	defaultSettingValuesActions,
	defaultSettingValuesSelectors,
} from "./default-setting-values";
import fallbacks, { createInitialFallbacksState, fallbacksActions, fallbacksSelectors } from "./fallbacks";
import linkParams, { createInitialLinkParamsState, linkParamsActions, linkParamsSelectors } from "./link-params";
import media, { createInitialMediaState, mediaActions, mediaControls, mediaSelectors } from "./media";
import notifications, { createInitialNotificationsState, notificationsActions, notificationsSelectors } from "./notifications";
import postTypes, { createInitialPostTypesState, postTypesActions, postTypesSelectors } from "./post-types";
import posts, { createInitialPostsState, postsActions, postsControls, postsSelectors } from "./posts";
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
			...defaultSettingValuesActions,
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
			...postsActions,
		},
		selectors: {
			...breadcrumbsSelectors,
			...defaultSettingValuesSelectors,
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
			...postsSelectors,
		},
		initialState: merge(
			{},
			{
				defaultSettingValues: createInitialDefaultSettingValuesState(),
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
				posts: createInitialPostsState(),
			},
			initialState
		),
		reducer: combineReducers( {
			defaultSettingValues,
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
			posts,
		} ),
		controls: {
			...mediaControls,
			...usersControls,
			...postsControls,
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
