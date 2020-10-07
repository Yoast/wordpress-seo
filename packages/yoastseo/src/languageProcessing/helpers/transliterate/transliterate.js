/** @module stringProcessing/replaceDiacritics */

import transliterationsMap from "../../../config/_todo/transliterations.js";

/**
 * Replaces all special characters from the text based on the transliterations map.
 *
 * @param {string} text The text to remove special characters from.
 * @param {string} locale The locale.
 * @param {array} config The transliteration config.
 * @returns {string} The text with all special characters replaced.
 */
export default function( text, locale, config ) {
	var map = config( locale );
	for ( var i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letter,
			map[ i ].alternative
		);
	}
	return text;
}
