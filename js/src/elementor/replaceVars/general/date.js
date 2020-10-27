/**
 * Returns the replacement for the %%date%% variable.
 * @returns {string} The date string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.date || "";
}

/**
 * Replaces the %%date%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%date%%", "g" ),
		getReplacement()
	);
}
