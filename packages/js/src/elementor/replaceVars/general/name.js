import { get } from "lodash";

/**
 * Returns the replacement for the %%name%% variable.
 *
 * @returns {string} The author's `nicename`.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.name", "" );
}

/**
 * Represents the name replacement variable.
 *
 * @returns {Object} The name replacement variable.
 */
export default {
	name: "name",
	label: "Name",
	placeholder: "%%name%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%name%%", "g" ),
};
