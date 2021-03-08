import { get } from "lodash";

/**
 * Returns the replacement for the %%tag%% variable.
 *
 * @returns {string} The tag.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.tag", "" );
}

/**
 * Represents the tag replacement variable.
 *
 * @returns {Object} The tag replacement variable.
 */
export default {
	name: "tag",
	label: "Tag",
	placeholder: "%%tag%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%tag%%", "g" ),
};
