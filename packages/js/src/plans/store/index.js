// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { actions, reducers, selectors } from "@yoast/externals/redux";
import { merge } from "lodash";
import {
	ADMIN_URL_NAME,
	adminUrlActions,
	adminUrlReducer,
	adminUrlSelectors,
	getInitialAdminUrlState,
	getInitialLinkParamsState,
	LINK_PARAMS_NAME,
	linkParamsActions,
	linkParamsReducer,
	linkParamsSelectors,
} from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import { getInitialPreferencesState, PREFERENCES_NAME, preferencesActions, preferencesReducer, preferencesSelectors } from "./preferences";

const { isPremium } = reducers;
const { getIsPremium } = selectors;
const { setIsPremium } = actions;

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...adminUrlActions,
			...linkParamsActions,
			...preferencesActions,
			setIsPremium,
		},
		selectors: {
			...adminUrlSelectors,
			...linkParamsSelectors,
			...preferencesSelectors,
			getIsPremium,
		},
		initialState: merge(
			{},
			{
				[ ADMIN_URL_NAME ]: getInitialAdminUrlState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ PREFERENCES_NAME ]: getInitialPreferencesState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ ADMIN_URL_NAME ]: adminUrlReducer,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ PREFERENCES_NAME ]: preferencesReducer,
			isPremium,
		} ),
	} );
};

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
export const registerStore = ( { initialState = {} } = {} ) => {
	register( createStore( { initialState } ) );
};
