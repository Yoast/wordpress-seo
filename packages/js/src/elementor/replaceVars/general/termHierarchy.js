import { get } from "lodash";

/**
 * Returns the replacement for the %%term_hierarchy%% variable.
 *
 * @returns {string} The term_hierarchy.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.term_hierarchy", "" );
}

/**
 * Represents the term_hierarchy replacement variable.
 *
 * @returns {Object} The term_hierarchy replacement variable.
 */
export default {
	name: "term_hierarchy",
	label: "Term hierarchy",
	placeholder: "%%term_hierarchy%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%term_hierarchy%%", "g" ),
};
