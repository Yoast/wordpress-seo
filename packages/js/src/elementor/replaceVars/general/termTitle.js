import { get } from "lodash";

/**
 * Returns the replacement for the %%term_title%% variable.
 *
 * @returns {string} The term_title.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.term_title", "" );
}

/**
 * Represents the term_title replacement variable.
 *
 * @returns {Object} The term_title replacement variable.
 */
export default {
	name: "term_title",
	label: "Term title",
	placeholder: "%%term_title%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%term_title%%", "g" ),
};
