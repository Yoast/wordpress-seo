import { select } from "@wordpress/data";

/**
 * Returns the replacement for the %%keyword%% variable.
 * @returns {string} The keyword string.
 */
function getReplacement() {
	return select( "yoast-seo/editor" ).getFocusKeyphrase();
}

/**
 * Replaces the %%keyword%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%keyword|focuskw%%", "g" ),
		getReplacement()
	);
}
