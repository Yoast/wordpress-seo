import excludeTableOfContentsTag from "./excludeTableOfContentsTag";
import { stripFullTags as stripTags } from "./stripHTMLTags.js";

/**
 * Sanitizes the text before we use the text for the analysis.
 *
 * @param {String} text The text to be sanitized.
 *
 * @returns {String} The sanitized text.
 */
export default function( text ) {
	text = excludeTableOfContentsTag( text );
	text = stripTags( text );

	return text;
}
