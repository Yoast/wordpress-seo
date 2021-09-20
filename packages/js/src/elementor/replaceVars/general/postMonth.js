import { get } from "lodash";

/**
 * Returns the replacement for the %%post_month%% variable.
 *
 * @returns {string} The post day.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.post_month", "" );
}

/**
 * Represents the sep replacement variable.
 *
 * @returns {Object} The sep replacement variable.
 */
export default {
	name: "post_month",
	label: "Post Month",
	placeholder: "%%post_month%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%post_month%%", "g" ),
};
