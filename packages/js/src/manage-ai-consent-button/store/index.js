import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import {
	getInitialHasAiGeneratorConsentState,
	getInitialLinkParamsState,
	getInitialPluginUrlState,
	getInitialWistiaEmbedPermissionState,
	HAS_AI_GENERATOR_CONSENT_NAME,
	hasAiGeneratorConsentActions,
	hasAiGeneratorConsentControls,
	hasAiGeneratorConsentReducer,
	hasAiGeneratorConsentSelectors,
	LINK_PARAMS_NAME,
	linkParamsActions,
	linkParamsReducer,
	linkParamsSelectors,
	PLUGIN_URL_NAME,
	pluginUrlActions,
	pluginUrlReducer,
	pluginUrlSelectors,
	WISTIA_EMBED_PERMISSION_NAME,
	wistiaEmbedPermissionActions,
	wistiaEmbedPermissionControls,
	wistiaEmbedPermissionReducer,
	wistiaEmbedPermissionSelectors,
} from "../../shared-admin/store";
import { STORE_NAME_CONSENT_BUTTON } from "../constants";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( initialState ) => {
	return createReduxStore( STORE_NAME_CONSENT_BUTTON, {
		actions: {
			...hasAiGeneratorConsentActions,
			...pluginUrlActions,
			...linkParamsActions,
			...wistiaEmbedPermissionActions,
		},
		selectors: {
			...hasAiGeneratorConsentSelectors,
			...pluginUrlSelectors,
			...linkParamsSelectors,
			...wistiaEmbedPermissionSelectors,
		},
		initialState: merge(
			{},
			{
				[ HAS_AI_GENERATOR_CONSENT_NAME ]: getInitialHasAiGeneratorConsentState(),
				[ PLUGIN_URL_NAME ]: getInitialPluginUrlState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ WISTIA_EMBED_PERMISSION_NAME ]: getInitialWistiaEmbedPermissionState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ HAS_AI_GENERATOR_CONSENT_NAME ]: hasAiGeneratorConsentReducer,
			[ PLUGIN_URL_NAME ]: pluginUrlReducer,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ WISTIA_EMBED_PERMISSION_NAME ]: wistiaEmbedPermissionReducer,
		} ),
		controls: {
			...hasAiGeneratorConsentControls,
			...wistiaEmbedPermissionControls,
		},
	} );
};

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
export const registerStore = ( initialState = {} ) => {
	register( createStore( initialState ) );
};
