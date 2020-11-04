import { get } from "lodash";

/**
 * Returns the replacement for the %%category%% variable.
 * @returns {string} The category string.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.category", "" );
}

/**
 * Replaces the %%category%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%category%%", "g" ),
		getReplacement()
	);
}
