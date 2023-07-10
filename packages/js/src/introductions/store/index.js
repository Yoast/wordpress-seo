// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import {
	getInitialLinkParamsState,
	getInitialPluginUrlState,
	LINK_PARAMS_NAME,
	linkParamsActions,
	linkParamsReducer,
	linkParamsSelectors,
	PLUGIN_URL_NAME,
	pluginUrlActions,
	pluginUrlReducer,
	pluginUrlSelectors,
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
		},
		selectors: {
			...introductionsSelectors,
			...linkParamsSelectors,
			...pluginUrlSelectors,
		},
		initialState: merge(
			{},
			{
				[ INTRODUCTIONS_NAME ]: getInitialIntroductionsState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ PLUGIN_URL_NAME ]: getInitialPluginUrlState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ INTRODUCTIONS_NAME ]: introductionsReducer,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ PLUGIN_URL_NAME ]: pluginUrlReducer,
		} ),
		controls: {},
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
