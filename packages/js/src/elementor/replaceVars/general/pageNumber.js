import { get } from "lodash";

/**
 * Returns the replacement for the %%pagenumber%% variable.
 *
 * @returns {string} The page number.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.pagenumber", "" );
}

/**
 * Represents the page_number replacement variable.
 *
 * @returns {Object} The page number replacement variable.
 */
export default {
	name: "pagenumber",
	label: "Pagenumber",
	placeholder: "%%pagenumber%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%pagenumber%%", "g" ),
};
