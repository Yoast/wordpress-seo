import { combineReducers, registerStore } from "@wordpress/data";
import { reducers, selectors, actions } from "@yoast/externals/redux";
import { get } from "lodash";
import * as controls from "../redux/controls/dismissedAlerts";

const { currentPromotions, dismissedAlerts, isPremium, linkParams  } = reducers;
const { isAlertDismissed, getIsPremium, isPromotionActive, selectLinkParams, selectLink } = selectors;
const { dismissAlert, setCurrentPromotions, setDismissedAlerts, setLinkParams, setIsPremium } = actions;

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
	store.dispatch( setCurrentPromotions( get( window, "wpseoScriptData.currentPromotions", {} ) ) );
	store.dispatch( setLinkParams( get( window, "wpseoScriptData.linkParams", {} ) ) );
}

/**
 * Initializes the Yoast SEO settings store.
 *
 * @returns {object} The Yoast SEO settings store.
 */
export default function initSettingsStore() {
	const store = registerStore( "yoast-seo/settings", {
		reducer: combineReducers( {
			currentPromotions,
			dismissedAlerts,
			isPremium,
			linkParams,
		} ),
		selectors: {
			isAlertDismissed,
			getIsPremium,
			isPromotionActive,
			selectLinkParams,
			selectLink,
		},
		actions: {
			dismissAlert,
			setCurrentPromotions,
			setDismissedAlerts,
			setLinkParams,
			setIsPremium,
		},
		controls,
	} );

	populateStore( store );

	return store;
}
