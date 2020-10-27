/**
 * Returns the replacement for the %%id%% variable.
 * @returns {string} The id string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.id || "";
}

/**
 * Replaces the %%id%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%id%%", "g" ),
		getReplacement()
	);
}
