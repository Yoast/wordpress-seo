// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { get, merge } from "lodash";
import { getInitialLinkParamsState, LINK_PARAMS_NAME, linkParamsActions, linkParamsReducer, linkParamsSelectors } from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import { reducers, selectors, actions } from "@yoast/externals/redux";
import * as controls from "../../redux/controls/dismissedAlerts";

const { currentPromotions, dismissedAlerts, isPremium  } = reducers;
const { isAlertDismissed, getIsPremium, isPromotionActive } = selectors;
const { dismissAlert, setCurrentPromotions, setDismissedAlerts, setIsPremium } = actions;

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...linkParamsActions,
			...preferencesActions,
			dismissAlert,
			setCurrentPromotions,
			setDismissedAlerts,
			setIsPremium
		},
		selectors: {
			...linkParamsSelectors,
			...preferencesSelectors,
			isAlertDismissed,
			getIsPremium,
			isPromotionActive,
		},
		initialState: merge(
			{},
			{
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
				currentPromotions: { promotions: get( window, "wpseoScriptData.currentPromotions", [] ) },
				dismissedAlerts: get( window, "wpseoScriptData.dismissedAlerts", {} ),
				isPremium: get( window, "wpseoScriptData.preferences.isPremium", false ),
			},
			initialState
		),
		reducer: combineReducers( {
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			preferences,
			currentPromotions,
			dismissedAlerts,
			isPremium,
		} ),
		controls,
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
