/**
 * Returns the replacement for the %%sitename%% variable.
 * @returns {string} The sitename string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.sitename || "";
}

/**
 * Replaces the %%sitename%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%sitename%%", "g" ),
		getReplacement()
	);
}
