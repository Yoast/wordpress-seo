/**
 * Returns the replacement for the %%sitedesc%% variable.
 * @returns {string} The sitedesc string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.sitedesc || "";
}

/**
 * Replaces the %%sitedesc%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%sitedesc%%", "g" ),
		getReplacement()
	);
}
