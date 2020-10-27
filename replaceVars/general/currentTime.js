/**
 * Returns the replacement for the %%currenttime%% variable.
 * @returns {string} The current time string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.currenttime || "";
}

/**
 * Replaces the %%currenttime%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%currenttime%%", "g" ),
		getReplacement()
	);
}
