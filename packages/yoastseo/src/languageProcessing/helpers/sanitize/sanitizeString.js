import excludeTableOfContentsTag from "./excludeTableOfContentsTag";
import excludeEstimatedReadingTime from "../sanitize/excludeEstimatedReadingTime";
import { stripFullTags as stripTags } from "./stripHTMLTags.js";
import { unifyAllSpaces } from "./unifyWhitespace";

/**
 * Sanitizes the text before we use the text for the analysis.
 *
 * @param {String} text The text to be sanitized.
 *
 * @returns {String} The sanitized text.
 */
export default function( text ) {
	// Unify whitespaces and non-breaking spaces.
	text = unifyAllSpaces( text );
	// Remove Table of Contents.
	text = excludeTableOfContentsTag( text );
	// Remove Estimated reading time
	text = excludeEstimatedReadingTime( text );
	// Strip the tags and multiple spaces.
	text = stripTags( text );

	return text;
}
