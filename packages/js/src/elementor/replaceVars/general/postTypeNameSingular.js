import { get } from "lodash";

/**
 * Returns the replacement for the %%pt_single%% variable.
 *
 * @returns {string} The post type name singular.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pt_single", "" );
}

/**
 * Represents the post type name singular replacement variable.
 *
 * @returns {Object} The post type name singular replacement variable.
 */
export default {
	name: "pt_single",
	label: "Post type (singular)",
	placeholder: "%%pt_single%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%pt_single%%", "g" ),
};
