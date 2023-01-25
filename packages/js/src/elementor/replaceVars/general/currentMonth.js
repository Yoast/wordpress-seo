import { get } from "lodash";

/**
 * Returns the replacement for the %%currentmonth%% variable.
 *
 * @returns {string} The current month.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.currentmonth", "" );
}

/**
 * Represents the current month replacement variable.
 *
 * @returns {Object} The current month replacement variable.
 */
export default {
	name: "currentmonth",
	label: "Current month",
	placeholder: "%%currentmonth%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%currentmonth%%", "g" ),
};
