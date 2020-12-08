import { get } from "lodash";

/**
 * Returns the replacement for the %%user_description%% variable.
 *
 * @returns {string} The author's ‘Biographical Info’.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.user_description", "" );
}

/**
 * Represents the name replacement variable.
 *
 * @returns {Object} The name replacement variable.
 */
export default {
	name: "user_description",
	label: "User description",
	placeholder: "%%user_description%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%user_description%%", "g" ),
};
