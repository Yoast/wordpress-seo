/* External dependencies */
import { create } from "@wordpress/rich-text";

/**
 * Removes HTML in a string.
 *
 * @param {string} content Content which might contain HTML.
 *
 * @returns {string} Content without HTML.
 */
export function removeHTML( content ) {
	// When there is a suspicion of HTML in the content, use the thorough method to extract the text.
	if ( content.includes( "<" ) ) {
		const formattedContent = create( { html: content } );

		return formattedContent.text;
	}

	return content;
}

/**
 * Normalizes whitespace in a string.
 *
 * @param {string} content Content which might contain newlines.
 *
 * @returns {string} Content without newlines.
 */
export function normalizeWhitespace( content ) {
	return content.replace( /\n/, " " );
}
