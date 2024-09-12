import { get } from "lodash";
import { getIsProduct } from "./editorContext";

/**
 * Gets a preference.
 *
 * @param {Object} state The state object.
 * @param {string} path The path of the preference.
 * @param {*} fallback The fallback value.
 *
 * @returns {*} The preference or fallback value.
 */
export const getPreference = ( state, path, fallback = null ) => get( state, `preferences.${ path }`, fallback );

/**
 * Gets the preferences.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The preferences.
 */
export const getPreferences = state => state.preferences;

/**
 * Gets the isKeywordAnalysisActive.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} The isKeywordAnalysisActive.
 */
export const getIsKeywordAnalysisActive = state => get( state, "preferences.isKeywordAnalysisActive", false );

/**
 * Determines whether the WooCommerce SEO addon is not active in a product page.
 *
 * @param {Object} state The state.
 * @returns {Boolean} Whether the plugin is WooCommerce SEO or not.
 */
export const getIsWooSeoUpsell = ( state ) => {
	const isWooSeoActive = getPreference( state, "isWooSeoActive" );
	const isWooCommerceActive = getPreference( state, "isWooCommerceActive" );
	const isProductPage = getIsProduct( state );

	return ! isWooSeoActive && isWooCommerceActive && isProductPage;
};

/**
 * Get the preference for the isWooCommerceActive.
 *
 * @param {Object} state The state.
 * @returns {Boolean} The preference for the isWooCommerceActive.
 */
export const getIsWooCommerceActive = state => getPreference( state, "isWooCommerceActive", false );

/**
 * Get the preference for the isWooSeoActive.
 *
 * @param {Object} state The state.
 * @returns {Boolean} The preference for the isWooSeoActive.
 */
export const getIsWooSeoActive = state => getPreference( state, "isWooCommerceSeoActive", false );
