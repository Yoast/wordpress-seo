import { get } from "lodash";

/**
 * Returns the replacement for the %%permalink%% variable.
 *
 * @returns {string} The permalink.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.permalink", "" );
}

/**
 * Represents the sep replacement variable.
 *
 * @returns {Object} The sep replacement variable.
 */
export default {
	name: "permalink",
	label: "Permalink",
	placeholder: "%%permalink%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%permalink%%", "g" ),
};
