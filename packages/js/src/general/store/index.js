// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { getInitialLinkParamsState, LINK_PARAMS_NAME, linkParamsActions, linkParamsReducer, linkParamsSelectors } from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import { reducers, selectors, actions } from "@yoast/externals/redux";
import * as dismissedAlertsControls from "../../redux/controls/dismissedAlerts";
import { alertCenterReducer, alertCenterActions, alertCenterSelectors, getInitialAlertCenterState, alertCenterControls, ALERT_CENTER_NAME } from "./alert-center";
import { adminNoticesActions, adminNoticesReducer, adminNoticesSelectors, ADMIN_NOTICES_NAME, getInitialAdminNoticesState } from "./admin-notices";

const { currentPromotions, dismissedAlerts, isPremium } = reducers;
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
			...adminNoticesActions,
		},
		selectors: {
			...linkParamsSelectors,
			...preferencesSelectors,
			...alertCenterSelectors,
			isAlertDismissed,
			getIsPremium,
			isPromotionActive,
			...adminNoticesSelectors,
		},
		initialState: merge(
			{},
			{
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
				[ ALERT_CENTER_NAME ]: getInitialAlertCenterState(),
				currentPromotions: { promotions: [] },
				[ ADMIN_NOTICES_NAME ]: getInitialAdminNoticesState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			preferences,
			[ ALERT_CENTER_NAME ]: alertCenterReducer,
			currentPromotions,
			dismissedAlerts,
			isPremium,
			[ ADMIN_NOTICES_NAME ]: adminNoticesReducer,
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
