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
 * Represents the permalink replacement variable.
 *
 * @returns {Object} The permalink replacement variable.
 */
export default {
	name: "permalink",
	label: "Permalink",
	placeholder: "%%permalink%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%permalink%%", "g" ),
};
