import { get } from "lodash";

/**
 * Returns the replacement for the %%post_year%% variable.
 *
 * @returns {string} The post year.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_year", "" );
}

/**
 * Represents the post year replacement variable.
 *
 * @returns {Object} The post year replacement variable.
 */
export default {
	name: "post_year",
	label: "Post Year",
	placeholder: "%%post_year%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%post_year%%", "g" ),
};
