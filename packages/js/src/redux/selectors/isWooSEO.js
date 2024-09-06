import { get } from "lodash";
import { getIsProduct } from "./editorContext";

/**
 * Determines whether the WooCommerce SEO addon is active.
 *
 * @returns {Boolean} Whether the plugin is WooCommerce SEO or not.
 */
export const getIsWooSeoActive = () => Boolean( get( window, "wpseoScriptData.isWooCommerceSeoActive", false ) );

/**
 * Checks if WooCommerce is active.
 *
 * @returns {boolean} True if WooCommerce is active.
 */
export const getIsWooCommerceActive = () => get( window, "wpseoScriptData.metabox.isWooCommerceActive", false );

/**
 * Determines whether the WooCommerce SEO addon is not active in a product page.
 *
 * @param {Object} state The state.
 * @returns {Boolean} Whether the plugin is WooCommerce SEO or not.
 */
export const getIsWooSeoUpsell = ( state ) => {
	const isWooSeoActive = getIsWooSeoActive();
	const isWooCommerceActive = getIsWooCommerceActive();
	const isProductPage = getIsProduct( state );

	return ! isWooSeoActive && isWooCommerceActive && isProductPage;
};
