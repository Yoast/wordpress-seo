import { get } from "lodash";

/**
 * Returns the replacement for the %%currentday%% variable.
 *
 * @returns {string} The current day.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentday", "" );
}

/**
 * Represents the sep replacement variable.
 *
 * @returns {Object} The sep replacement variable.
 */
export default {
	name: "currentday",
	label: "Current day",
	placeholder: "%%currentday%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%currentday%%", "g" ),
};
