import { get } from "lodash";

/**
 * Returns the replacement for the %%currentyear%% variable.
 *
 * @returns {string} The current year.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentyear", "" );
}

/**
 * Represents the current year replacement variable.
 *
 * @returns {Object} The current year replacement variable.
 */
export default {
	name: "currentyear",
	label: "Current year",
	placeholder: "%%currentyear%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%currentyear%%", "g" ),
};
