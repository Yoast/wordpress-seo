import { combineReducers, registerStore } from "@wordpress/data";
import { reducers, selectors, actions } from "@yoast/externals/redux";
import { get } from "lodash";
import * as controls from "../redux/controls/dismissedAlerts";

const { dismissedAlerts, isPremium } = reducers;
const { isAlertDismissed, getIsPremium } = selectors;
const { dismissAlert, setDismissedAlerts, setIsPremium } = actions;

/**
 * Populates the store.
 *
 * @param {Object} store The store to populate.
 *
 * @returns {void}
 */
function populateStore( store ) {
	store.dispatch( setDismissedAlerts( get( window, "wpseoScriptData.dismissedAlerts", {} ) ) );
	store.dispatch( setIsPremium( Boolean( get( window, "wpseoScriptData.isPremium", false ) ) ) );
}

/**
 * Initializes the Yoast SEO settings store.
 *
 * @returns {object} The Yoast SEO settings store.
 */
export default function initSettingsStore() {
	const store = registerStore( "yoast-seo/settings", {
		reducer: combineReducers( {
			dismissedAlerts,
			isPremium,
		} ),
		selectors: {
			isAlertDismissed,
			getIsPremium,
		},
		actions: {
			dismissAlert,
			setDismissedAlerts,
			setIsPremium,
		},
		controls,
	} );

	populateStore( store );

	return store;
}
