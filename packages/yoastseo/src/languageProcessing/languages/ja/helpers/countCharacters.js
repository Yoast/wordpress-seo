import { stripFullTags as stripTags } from "../../../helpers/sanitize/stripHTMLTags.js";

/**
 * Calculates the character count of a certain text.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {int} The word count of the given text.
 */
export default function( text ) {
	text = stripTags( text );
	return text.length;
}
