/** @module stringProcessing/replaceDiacritics */

import diacriticsRemovalMap from "../../../config/diacritics.js";

/**
 * Replaces all diacritics from the text based on the diacritics removal map.
 *
 * @param {string} text The text to remove diacritics from.
 *
 * @returns {string} The text with all diacritics replaced.
 */
export default function( text ) {
	const map = diacriticsRemovalMap();

	for ( let i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letters,
			map[ i ].base
		);
	}
	return text;
}
