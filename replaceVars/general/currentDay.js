/**
 * Returns the replacement for the %%currentday%% variable.
 * @returns {string} The current day string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.currentday || "";
}

/**
 * Replaces the %%currentday%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%currentday%%", "g" ),
		getReplacement()
	);
}
