import { get } from "lodash";

/**
 * Returns the replacement for the %%pt_plural%% variable.
 *
 * @returns {string} The post type name plural.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pt_plural", "" );
}

/**
 * Represents the post type name singular replacement variable.
 *
 * @returns {Object} The post type name singular replacement variable.
 */
export default {
	name: "pt_plural",
	label: "Post type (plural)",
	placeholder: "%%pt_plural%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%pt_plural%%", "g" ),
};
