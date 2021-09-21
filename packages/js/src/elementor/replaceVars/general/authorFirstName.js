import { get } from "lodash";

/**
 * Returns the replacement for the %%author_first_name%% variable.
 *
 * @returns {string} The author's first name.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.author_first_name", "" );
}

/**
 * Represents the author first name replacement variable.
 *
 * @returns {Object} The author first name replacement variable.
 */
export default {
	name: "author_first_name",
	label: "Author first name",
	placeholder: "%%author_first_name%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%author_first_name%%", "g" ),
};
