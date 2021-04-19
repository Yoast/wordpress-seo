import { get } from "lodash";

/**
 * Returns the replacement for the %%primary_category%% variable.
 *
 * @returns {string} The primary_category.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.primary_category", "" );
}

/**
 * Represents the primary category replacement variable.
 *
 * @returns {Object} The primary category replacement variable.
 */
export default {
	name: "primary_category",
	label: "Primary category",
	placeholder: "%%primary_category%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%primary_category%%", "g" ),
};
