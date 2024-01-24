import { languageProcessing } from "yoastseo";
const { sanitizeString } = languageProcessing;
import removeURLs from "../../../helpers/sanitize/removeURLs.js";

/**
 * Calculates the character count which serves as a measure of text length.
 * The character count includes letters, punctuation, and numbers. It doesn't include URLs, HTML tags, and spaces.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {number} The character count of the given text.
 */
export default function( text ) {
	text = removeURLs( text );
	text = sanitizeString( text );
	text = text.replace( /\s/g, "" );

	return text.length;
}
