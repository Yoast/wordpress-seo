/**
 * Returns the replacement for the %%currentdate%% variable.
 * @returns {string} The current date string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.currentdate || "";
}

/**
 * Replaces the %%currentdate%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%currentdate%%", "g" ),
		getReplacement()
	);
}
