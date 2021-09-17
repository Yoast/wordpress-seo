import { get } from "lodash";

/**
 * Returns the replacement for the %%post_content%% variable.
 *
 * @returns {string} The post content.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_content", "" );
}

/**
 * Represents the sep replacement variable.
 *
 * @returns {Object} The sep replacement variable.
 */
export default {
	name: "post_content",
	label: "Post Content",
	placeholder: "%%post_content%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%post_content%%", "g" ),
};
