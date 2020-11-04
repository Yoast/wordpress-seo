import { get } from "lodash";

/**
 * Returns the replacement for the %%term_description%% variable.
 * @returns {string} The term_description string.
 */
function getReplacement() {
	return get( window, "YoastSEO.app.rawData.text", "" );
}

/**
 * Replaces the %%term_description%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%term_description%%|%%tag_description%%|%%category_description%%", "g" ),
		getReplacement()
	);
}
