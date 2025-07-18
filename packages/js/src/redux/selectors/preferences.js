import { createSelector } from "@reduxjs/toolkit";
import { select } from "@wordpress/data";
import { get } from "lodash";
import { getIsProductEntity, getIsProductTerm } from "./editorContext";

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

/**
 * Determines whether the WooCommerce SEO addon is not active in a product entity.
 *
 * @param {Object} state The state.
 * @returns {Boolean} Whether the WooCommerce SEO addon is not active in a product entity.
 */
export const getIsWooSeoUpsell = createSelector(
	[ getIsWooSeoActive, getIsWooCommerceActive, getIsProductEntity ],
	( isWooSeoActive, isWooCommerceActive, isProduct ) => ! isWooSeoActive && isWooCommerceActive && isProduct
);

/**
 * Determines whether the WooCommerce SEO addon is not active in a product term.
 *
 * @param {Object} state The state.
 * @returns {Boolean} Whether the WooCommerce SEO addon is not active in a product term.
 */
export const getIsWooSeoUpsellTerm = createSelector(
	[ getIsWooSeoActive, getIsWooCommerceActive, getIsProductTerm ],
	( isWooSeoActive, isWooCommerceActive, isProductTerm ) => ! isWooSeoActive && isWooCommerceActive && isProductTerm
);

/**
 * @deprecated This function is deprecated and will be removed in future versions.
 * Please use the getIsAiFeatureEnabled from yoast-seo-premium store instead.
 *
 * @returns {boolean} Whether the AI feature is enabled.
 */
export const getIsAiFeatureEnabled = () => {
	const getIsAiFeatureEnabledFromPremium = select( "yoast-seo-premium/editor" )?.getIsAiFeatureEnabled;
	return getIsAiFeatureEnabledFromPremium ? getIsAiFeatureEnabledFromPremium() : Boolean( window.wpseoAdminL10n.isAiFeatureActive );
};
