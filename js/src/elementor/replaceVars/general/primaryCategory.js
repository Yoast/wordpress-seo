import { __ } from "@wordpress/i18n";
import { get } from "lodash";

/**
 * Returns the replacement for the %%primary_category%% variable.
 *
 * @returns {string} The primary_category.
 */
function getReplacement() {
	return get( window, "YoastSEO.app.rawData.primaryCategory", "" );
}

/**
 * Represents the primary category replacement variable.
 *
 * @returns {Object} The primary category replacement variable.
 */
export default {
	name: "primary_category",
	label: __( "Primary category", "wordpress-seo" ),
	placeholder: "%%primary_category%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%primary_category%%", "g" ),
};
