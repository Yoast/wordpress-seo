import { get } from "lodash";

/**
 * Returns the replacement for the %%sep%% variable.
 * @returns {string} The current time string.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.sep", "" );
}

/**
 * Replaces the %%sep%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%sep%%(\\s*%%sep%%)*", "g" ),
		getReplacement()
	);
}
