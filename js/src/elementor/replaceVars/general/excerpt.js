/**
 * Returns the replacement for the %%excerpt%% variable.
 * @returns {string} The excerpt string.
 */
function getReplacement() {
	return window.YoastSEO.app.rawData.excerpt || "";
}

/**
 * Replaces the %%excerpt%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%excerpt%%|%%excerpt_only%%", "g" ),
		getReplacement()
	);
}
