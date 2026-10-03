import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import {
	ADMIN_URL_NAME,
	adminUrlActions,
	adminUrlReducer,
	adminUrlSelectors,
	getInitialAdminUrlState,
	getInitialHasAiGeneratorConsentState,
	getInitialLinkParamsState,
	getInitialPluginUrlState,
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
} from "../../shared-admin/store";
import { STORE_NAME_AI_CONSENT } from "../constants";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( initialState ) => {
	return createReduxStore( STORE_NAME_AI_CONSENT, {
		actions: {
			...hasAiGeneratorConsentActions,
			...pluginUrlActions,
			...linkParamsActions,
			...adminUrlActions,
		},
		selectors: {
			...hasAiGeneratorConsentSelectors,
			...pluginUrlSelectors,
			...linkParamsSelectors,
			...adminUrlSelectors,
		},
		initialState: merge(
			{},
			{
				[ HAS_AI_GENERATOR_CONSENT_NAME ]: getInitialHasAiGeneratorConsentState(),
				[ PLUGIN_URL_NAME ]: getInitialPluginUrlState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ ADMIN_URL_NAME ]: getInitialAdminUrlState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ HAS_AI_GENERATOR_CONSENT_NAME ]: hasAiGeneratorConsentReducer,
			[ PLUGIN_URL_NAME ]: pluginUrlReducer,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ ADMIN_URL_NAME ]: adminUrlReducer,
		} ),
		controls: {
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
