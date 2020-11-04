import { get } from "lodash";

/**
 * Returns the replacement for the %%page%% variable.
 * @returns {string} The page string.
 */
function getReplacement() {
	return get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.page", "" );
}

/**
 * Replaces the %%page%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%page%%", "g" ),
		getReplacement()
	);
}
