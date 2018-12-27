/**
 * Strips HTML tags from a text.
 *
 * This function can be replaced by wp.sanitize.stripTags as soon as Wordpress 5.0 has been
 * released and we drop 4.8.x support. See #11706.
 *
 * @param {string} text The text to strip tags from.
 * @returns {string} The text without tags.
 */
export function stripTags( text ) {
	text = text || "";

	return text
		.replace( /<!--[\s\S]*?(-->|$)/g, "" )
		.replace( /<(script|style)[^>]*>[\s\S]*?(<\/\1>|$)/ig, "" )
		.replace( /<\/?[a-z][\s\S]*?(>|$)/ig, "" );
}
