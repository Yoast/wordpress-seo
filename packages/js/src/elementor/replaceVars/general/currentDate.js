import { get } from "lodash";

/**
 * Returns the replacement for the %%currentdate%% variable.
 *
 * @returns {string} The current date.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentdate", "" );
}

/**
 * Represents the current date replacement variable.
 *
 * @returns {Object} The current date replacement variable.
 */
export default {
	name: "currentdate",
	label: "Current date",
	placeholder: "%%currentdate%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%currentdate%%", "g" ),
};
