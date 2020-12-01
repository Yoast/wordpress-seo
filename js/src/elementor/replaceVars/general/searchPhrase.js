import { __ } from "@wordpress/i18n";
import { get } from "lodash";

/**
 * Returns the replacement for the %%searchphrase%% variable.
 *
 * @returns {string} The searchphrase.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.searchphrase", "" );
}

/**
 * Represents the searchphrase replacement variable.
 *
 * @returns {Object} The searchphrase replacement variable.
 */
export default {
	name: "searchphrase",
	label: __( "Search phrase", "wordpress-seo" ),
	placeholder: "%%searchphrase%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%searchphrase%%", "g" ),
};
