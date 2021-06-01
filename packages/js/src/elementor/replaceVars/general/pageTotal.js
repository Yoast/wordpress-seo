import { get } from "lodash";

/**
 * Returns the replacement for the %%pagetotal%% variable.
 *
 * @returns {string} The page total.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pagetotal", "" );
}

/**
 * Represents the page_total replacement variable.
 *
 * @returns {Object} The page total replacement variable.
 */
export default {
	name: "pagetotal",
	label: "Pagetotal",
	placeholder: "%%pagetotal%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%pagetotal%%", "g" ),
};
