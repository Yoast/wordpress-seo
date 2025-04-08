// eslint-disable-next-line import/named
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { actions, reducers, selectors } from "@yoast/externals/redux";
import { merge } from "lodash";
import * as dismissedAlertsControls from "../../redux/controls/dismissedAlerts";
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
import { ADMIN_NOTICES_NAME, adminNoticesActions, adminNoticesReducer, adminNoticesSelectors, getInitialAdminNoticesState } from "./admin-notices";
import {
	ALERT_CENTER_NAME,
	alertCenterActions,
	alertCenterControls,
	alertCenterReducer,
	alertCenterSelectors,
	getInitialAlertCenterState,
} from "./alert-center";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";

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
			...adminUrlActions,
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
			...adminUrlSelectors,
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
				[ ADMIN_URL_NAME ]: getInitialAdminUrlState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
				[ ALERT_CENTER_NAME ]: getInitialAlertCenterState(),
				currentPromotions: { promotions: [] },
				[ ADMIN_NOTICES_NAME ]: getInitialAdminNoticesState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ ADMIN_URL_NAME ]: adminUrlReducer,
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
