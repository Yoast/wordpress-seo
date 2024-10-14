// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { get, merge } from "lodash";
import { getInitialLinkParamsState, LINK_PARAMS_NAME, linkParamsActions, linkParamsReducer, linkParamsSelectors } from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import { reducers, selectors, actions } from "@yoast/externals/redux";
import * as dismissedAlertsControls from "../../redux/controls/dismissedAlerts";
import alertCenter, { alertCenterActions, alertCenterSelectors, getInitialAlertCenterState, alertCenterControls, ALERT_CENTER_NAME } from "./alert-center";

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
			...alertCenterActions,
			dismissAlert,
			setCurrentPromotions,
			setDismissedAlerts,
			setIsPremium,
		},
		selectors: {
			...linkParamsSelectors,
			...preferencesSelectors,
			...alertCenterSelectors,
			isAlertDismissed,
			getIsPremium,
			isPromotionActive,
		},
		initialState: merge(
			{},
			{
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
				[ ALERT_CENTER_NAME ]: getInitialAlertCenterState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			preferences,
			[ ALERT_CENTER_NAME ]: alertCenter,
			currentPromotions,
			dismissedAlerts,
			isPremium,
		} ),
		controls: {
			...alertCenterControls,
			...dismissedAlertsControls,
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
