import { get } from "lodash";

/**
 * Returns the replacement for the %%author_last_name%% variable.
 *
 * @returns {string} The author's last name.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.author_last_name", "" );
}

/**
 * Represents the author last name replacement variable.
 *
 * @returns {Object} The author last name replacement variable.
 */
export default {
	name: "author_last_name",
	label: "Author last name",
	placeholder: "%%author_last_name%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%author_last_name%%", "g" ),
};
