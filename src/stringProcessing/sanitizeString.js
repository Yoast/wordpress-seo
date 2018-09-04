/** @module stringProcessing/sanitizeString */

import { stripFullTags as stripTags } from "../stringProcessing/stripHTMLTags.js";

import stripSpaces from "../stringProcessing/stripSpaces.js";

/**
 * Strip HTMLtags characters from string that break regex
 *
 * @param {String} text The text to strip the characters from.
 * @returns {String} The text without characters.
 */
export default function( text ) {
	text = stripTags( text );
	text = stripSpaces( text );

	return text;
}
