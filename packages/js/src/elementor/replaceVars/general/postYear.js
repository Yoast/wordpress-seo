import { get } from "lodash";

/**
 * Returns the replacement for the %%post_year%% variable.
 *
 * @returns {string} The post day.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_year", "" );
}

/**
 * Represents the sep replacement variable.
 *
 * @returns {Object} The sep replacement variable.
 */
export default {
	name: "post_year",
	label: "Post Year",
	placeholder: "%%post_year%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%post_year%%", "g" ),
};
