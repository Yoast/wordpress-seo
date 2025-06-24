// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";

import { STORE_NAME } from "../constants";
import {
	linkParamsSelectors,
	NOTIFICATIONS_NAME,
	notificationsActions,
	notificationsReducer,
	notificationsSelectors,
} from "../../shared-admin/store";
import {
	FILTER_SLICE_NAME,
	filterActions,
	filterSelectors,
	getInitialFilterState,
	filterReducer,
} from "./filter-redirects";
import redirectsReducer, { getRedirectsInitialState, REDIRECTS_NAME, redirectsActions, redirectsControls, redirectsSelectors } from "./redirects";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import redirectsSettingsReducer, {
	getRedirectsSettingsInitialState,
	REDIRECTS_SETTINGS_NAME,
	redirectsSettingsActions,
	redirectsSettingsControls,
	redirectsSettingsSelectors,
} from "./redirects-settings";
import search, { createInitialSearchState, searchActions, searchSelectors } from "./search";


/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...filterActions,
			...notificationsActions,
			...redirectsActions,
			...preferencesActions,
			...redirectsSettingsActions,
			...searchActions,
		},
		selectors: {
			...linkParamsSelectors,
			...filterSelectors,
			...notificationsSelectors,
			...redirectsSelectors,
			...preferencesSelectors,
			...redirectsSettingsSelectors,
			...searchSelectors,
		},
		initialState: {
			[ FILTER_SLICE_NAME ]: getInitialFilterState(),
			[ REDIRECTS_NAME ]: getRedirectsInitialState(),
			[ REDIRECTS_SETTINGS_NAME ]: getRedirectsSettingsInitialState(),
			preferences: createInitialPreferencesState(),
			search: createInitialSearchState(),
			...initialState,
		},
		reducer: combineReducers( {
			[ FILTER_SLICE_NAME ]: filterReducer,
			[ NOTIFICATIONS_NAME ]: notificationsReducer,
			[ REDIRECTS_NAME ]: redirectsReducer,
			[ REDIRECTS_SETTINGS_NAME ]: redirectsSettingsReducer,
			search,
			preferences,
		} ),
		controls: {
			...redirectsControls,
			...redirectsSettingsControls,
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
