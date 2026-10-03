import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { STORE_NAME } from "../constants";
import {
	DOCUMENT_TITLE_NAME,
	documentTitleReducer,
	documentTitleSelectors,
	linkParamsSelectors,
	linkParamsReducer,
	linkParamsActions,
	LINK_PARAMS_NAME,
	WISTIA_EMBED_PERMISSION_NAME,
	wistiaEmbedPermissionReducer,
	wistiaEmbedPermissionActions,
	wistiaEmbedPermissionSelectors,
	pluginUrlSelectors,
	pluginUrlActions,
	PLUGIN_URL_NAME,
	getInitialPluginUrlState, pluginUrlReducer, wistiaEmbedPermissionControls,
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
			...pluginUrlActions,
			...wistiaEmbedPermissionActions,
		},
		selectors: {
			...documentTitleSelectors,
			...linkParamsSelectors,
			...preferencesSelectors,
			...wistiaEmbedPermissionSelectors,
			...pluginUrlSelectors,
		},
		initialState: merge(
			{},
			{
				[ PLUGIN_URL_NAME ]: getInitialPluginUrlState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ PREFERENCES_NAME ]: preferences,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ DOCUMENT_TITLE_NAME ]: documentTitleReducer,
			[ PLUGIN_URL_NAME ]: pluginUrlReducer,
			[ WISTIA_EMBED_PERMISSION_NAME ]: wistiaEmbedPermissionReducer,
		} ),
		controls: {
			...wistiaEmbedPermissionControls,
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
