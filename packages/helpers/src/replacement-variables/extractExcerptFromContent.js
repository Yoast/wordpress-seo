import { stripFullTags as stripTags } from "../strings/stripHTMLTags";

/**
 * Extracts the excerpt from the given content.
 *
 * @param {string} content The content.
 * @param {number} limit   The amount of characters to extract.
 *
 * @returns {string} The generated excerpt.
 */
export function excerptFromContent( content, limit = 156 ) {
	content = stripTags( content );
	content = content.trim();

	// When the content is shorter than 156 characters, use the entire content.
	if ( content.length <= limit ) {
		return content;
	}

	// Retrieves the first 156 chars from the content.
	content = content.substring( 0, limit );

	// Check if the description has space and trim the auto-generated string to a word boundary.
	if ( /\s/.test( content ) ) {
		content = content.substring( 0, content.lastIndexOf( " " ) );
	}

	return content;
}
