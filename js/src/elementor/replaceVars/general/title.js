import { select } from "@wordpress/data";

/**
 * Returns the replacement for the %%title%% variable.
 * @returns {string} The title string.
 */
function getReplacement() {
	return select( "yoast-seo/editor" ).getEditorDataTitle();
}

/**
 * Replaces the %%title%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%title%%", "g" ),
		getReplacement()
	);
}
