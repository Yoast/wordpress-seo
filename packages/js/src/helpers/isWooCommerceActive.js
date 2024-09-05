import { get } from "lodash";

/**
 * Checks if WooCommerce is active.
 *
 * @returns {boolean} True if WooCommerce is active.
 */
export const isWooCommerceActive = () => {
	return get( window, "wpseoScriptData.metabox.isWooCommerceActive", false );
};

