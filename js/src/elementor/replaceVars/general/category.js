import { __ } from "@wordpress/i18n";
import { get } from "lodash";

/**
 * Returns the replacement for the %%category%% variable.
 *
 * @returns {string} The category.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.category", "" );
}

/**
 * Represents the category replacement variable.
 *
 * @returns {Object} The category replacement variable.
 */
export default {
	name: "category",
	label: __( "Category", "wordpress-seo" ),
	placeholder: "%%category%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%category%%", "g" ),
};
