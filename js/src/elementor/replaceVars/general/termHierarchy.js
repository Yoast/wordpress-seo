import { get } from "lodash";

/**
 * Returns the replacement for the %%term_hierarchy%% variable.
 * @returns {string} The term_hierarchy string.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.term_hierarchy", "" );
}

/**
 * Replaces the %%term_hierarchy%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%term_hierarchy%%", "g" ),
		getReplacement()
	);
}
