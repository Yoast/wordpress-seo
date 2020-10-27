/**
 * Returns the replacement for the %%primary_category%% variable.
 * @returns {string} The primary_category string.
 */
function getReplacement() {
	return window.YoastSEO.app.rawData.primaryCategory || "";
}

/**
 * Replaces the %%primary_category%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%primary_category%%", "g" ),
		getReplacement()
	);
}
