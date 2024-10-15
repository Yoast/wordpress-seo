// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { reducers, selectors, actions } from "@yoast/externals/redux";
import {
	getInitialLinkParamsState,
	getInitialNotificationsState,
	LINK_PARAMS_NAME,
	linkParamsActions,
	linkParamsReducer,
	linkParamsSelectors,
	NOTIFICATIONS_NAME,
	notificationsActions,
	notificationsReducer,
	notificationsSelectors,
} from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import { breadcrumbsSelectors } from "./breadcrumbs";
import defaultSettingValues, {
	createInitialDefaultSettingValuesState,
	defaultSettingValuesActions,
	defaultSettingValuesSelectors,
} from "./default-setting-values";
import fallbacks, { createInitialFallbacksState, fallbacksActions, fallbacksSelectors } from "./fallbacks";
import media, { createInitialMediaState, mediaActions, mediaControls, mediaSelectors } from "./media";
import pageReducer, { getPageInitialState, PAGE_NAME, pageActions, pageControls, pageSelectors } from "./pages";
import postTypes, { createInitialPostTypesState, postTypeControls, postTypesActions, postTypesSelectors } from "./post-types";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import replacementVariables, {
	createInitialReplacementVariablesState,
	replacementVariablesActions,
	replacementVariablesSelectors,
} from "./replacement-variables";
import schema, { createInitialSchemaState, schemaActions, schemaSelectors } from "./schema";
import search, { createInitialSearchState, searchActions, searchSelectors } from "./search";
import taxonomies, { createInitialTaxonomiesState, taxonomiesActions, taxonomiesSelectors, taxonomyControls } from "./taxonomies";
import users, { createInitialUsersState, usersActions, usersControls, usersSelectors } from "./users";

const { isPromotionActive } = selectors;
const { currentPromotions } = reducers;
const { setCurrentPromotions } = actions;

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
			...pageActions,
			...postTypesActions,
			...preferencesActions,
			...replacementVariablesActions,
			...schemaActions,
			...searchActions,
			...taxonomiesActions,
			...usersActions,
			setCurrentPromotions,
		},
		selectors: {
			...breadcrumbsSelectors,
			...defaultSettingValuesSelectors,
			...fallbacksSelectors,
			...linkParamsSelectors,
			...mediaSelectors,
			...notificationsSelectors,
			...pageSelectors,
			...postTypesSelectors,
			...preferencesSelectors,
			...replacementVariablesSelectors,
			...schemaSelectors,
			...searchSelectors,
			...taxonomiesSelectors,
			...usersSelectors,
			isPromotionActive,
		},
		initialState: merge(
			{},
			{
				defaultSettingValues: createInitialDefaultSettingValuesState(),
				fallbacks: createInitialFallbacksState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				media: createInitialMediaState(),
				[ NOTIFICATIONS_NAME ]: getInitialNotificationsState(),
				[ PAGE_NAME ]: getPageInitialState(),
				postTypes: createInitialPostTypesState(),
				preferences: createInitialPreferencesState(),
				replacementVariables: createInitialReplacementVariablesState(),
				schema: createInitialSchemaState(),
				search: createInitialSearchState(),
				taxonomies: createInitialTaxonomiesState(),
				users: createInitialUsersState(),
				currentPromotions: { promotions: [] },
			},
			initialState
		),
		reducer: combineReducers( {
			defaultSettingValues,
			fallbacks,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			media,
			[ NOTIFICATIONS_NAME ]: notificationsReducer,
			[ PAGE_NAME ]: pageReducer,
			postTypes,
			preferences,
			replacementVariables,
			schema,
			search,
			taxonomies,
			users,
			currentPromotions,
		} ),
		controls: {
			...mediaControls,
			...usersControls,
			...postTypeControls,
			...taxonomyControls,
			...pageControls,
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
