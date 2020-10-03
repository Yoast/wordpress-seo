/** @module stringProcessing/replaceDiacritics */

import config from "../config/transliterations.js";
import transliterate from "../../../researches/stringProcessing/transliterate";

/**
 * Replaces all special characters from the text based on the transliterations map.
 *
 * @param {string} text The text to remove special characters from.
 * @param {string} locale The locale.
 * @returns {string} The text with all special characters replaced.
 */
export default function( text, locale ) {
	return transliterate( text, locale, config() );
}
