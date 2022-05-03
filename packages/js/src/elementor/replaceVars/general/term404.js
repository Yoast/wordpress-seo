import { get } from "lodash";

/**
 * Returns the replacement for the %%term404%% variable.
 *
 * @returns {string} The slug which caused the 404.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.term404", "" );
}

/**
 * Represents the term404 replacement variable.
 *
 * @returns {Object} The term404 replacement variable.
 */
export default {
	name: "term404",
	label: "Term404",
	placeholder: "%%term404%%",
	aliases: [],
	getReplacement,
	regexp: new RegExp( "%%term404%%", "g" ),
};
