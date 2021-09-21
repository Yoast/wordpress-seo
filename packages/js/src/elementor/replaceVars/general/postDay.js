import { get } from "lodash";

/**
 * Returns the replacement for the %%post_day%% variable.
 *
 * @returns {string} The post day.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_day", "" );
}

/**
 * Represents the post day replacement variable.
 *
 * @returns {Object} The post day replacement variable.
 */
export default {
	name: "post_day",
	label: "Post Day",
	placeholder: "%%post_day%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%post_day%%", "g" ),
};
