import transliterationsMap from "../../../config/getTransliterations.js";

/**
 * Replaces all special characters from the text based on the transliterations map.
 *
 * @param {string} text     The text to remove special characters from.
 * @param {string} locale   The locale.
 *
 * @returns {string} The text with all special characters replaced.
 */
export default function( text, locale ) {
	const map = transliterationsMap( locale );
	for ( let i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letter,
			map[ i ].alternative
		);
	}
	return text;
}
