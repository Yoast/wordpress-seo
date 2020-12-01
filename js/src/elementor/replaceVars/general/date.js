import { __ } from "@wordpress/i18n";
import { get } from "lodash";

/**
 * Returns the replacement for the %%date%% variable.
 *
 * @returns {string} The date.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.date", "" );
}

/**
 * Represents the date replacement variable.
 *
 * @returns {Object} The date replacement variable.
 */
export default {
	name: "date",
	label: __( "Date", "wordpress-seo" ),
	placeholder: "%%date%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%date%%", "g" ),
};
