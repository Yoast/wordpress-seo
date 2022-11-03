import { languageProcessing } from "yoastseo";
const { sanitizeString } = languageProcessing;
import removeURLs from "../../../helpers/sanitize/removeURLs.js";

/**
 * Calculates the character count of a text, including punctuation and numbers. Is used to determine length of text.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {number} The character count of the given text.
 */
export default function( text ) {
	text = removeURLs( text );
	text = sanitizeString( text );

	return text.length;
}
