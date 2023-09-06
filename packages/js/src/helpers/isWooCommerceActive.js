/**
 * Checks if WooCommerce is active.
 *
 * @returns {boolean} True if WooCommerce is active.
 */
export const isWooCommerceActive = () => {
	return window.wpseoScriptData && window.wpseoScriptData.isWooCommerceActive === "1";
};

