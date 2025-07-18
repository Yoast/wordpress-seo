// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import {
	getInitialLinkParamsState,
	getInitialPluginUrlState,
	getInitialWistiaEmbedPermissionState,
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
	getInitialHasAiGeneratorConsentState,
	HAS_AI_GENERATOR_CONSENT_NAME,
	hasAiGeneratorConsentActions,
	hasAiGeneratorConsentControls,
	hasAiGeneratorConsentReducer,
	hasAiGeneratorConsentSelectors,
} from "../../shared-admin/store";
import { STORE_NAME_INTRODUCTIONS } from "../constants";
import {
	getInitialIntroductionsState,
	INTRODUCTIONS_NAME,
	introductionsActions,
	introductionsReducer,
	introductionsSelectors,
} from "./introductions";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( initialState ) => {
	return createReduxStore( STORE_NAME_INTRODUCTIONS, {
		actions: {
			...introductionsActions,
			...linkParamsActions,
			...pluginUrlActions,
			...wistiaEmbedPermissionActions,
			...hasAiGeneratorConsentActions,
		},
		selectors: {
			...introductionsSelectors,
			...linkParamsSelectors,
			...pluginUrlSelectors,
			...wistiaEmbedPermissionSelectors,
			...hasAiGeneratorConsentSelectors,
		},
		initialState: merge(
			{},
			{
				[ INTRODUCTIONS_NAME ]: getInitialIntroductionsState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ PLUGIN_URL_NAME ]: getInitialPluginUrlState(),
				[ WISTIA_EMBED_PERMISSION_NAME ]: getInitialWistiaEmbedPermissionState(),
				[ HAS_AI_GENERATOR_CONSENT_NAME ]: getInitialHasAiGeneratorConsentState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ INTRODUCTIONS_NAME ]: introductionsReducer,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ PLUGIN_URL_NAME ]: pluginUrlReducer,
			[ WISTIA_EMBED_PERMISSION_NAME ]: wistiaEmbedPermissionReducer,
			[ HAS_AI_GENERATOR_CONSENT_NAME ]: hasAiGeneratorConsentReducer,
		} ),
		controls: {
			...wistiaEmbedPermissionControls,
			...hasAiGeneratorConsentControls,
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
