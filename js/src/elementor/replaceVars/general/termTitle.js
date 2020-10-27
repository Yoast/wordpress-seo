/**
 * Returns the replacement for the %%term_title%% variable.
 * @returns {string} The term_title string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.term_title || "";
}

/**
 * Replaces the %%term_title%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%term_title%%", "g" ),
		getReplacement()
	);
}
