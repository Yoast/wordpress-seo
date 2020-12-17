import { get } from "lodash";

/**
 * Returns the replacement for the %%modified%% variable.
 *
 * @returns {string} The modified time.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.modified", "" );
}

/**
 * Represents the modified replacement variable.
 *
 * @returns {Object} The modified replacement variable.
 */
export default {
	name: "modified",
	label: "Modified",
	placeholder: "%%modified%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%modified%%", "g" ),
};
