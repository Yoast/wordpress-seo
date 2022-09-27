/**
 * Replaces line break tag that contains an attribute with paragraph tag.
 * Line break tags with attribute aren't properly sanitized using wordpress `autop` function.
 *
 * @param {string} text The text to sanitize.
 *
 * @returns {string} The sanitized text.
 */
export default function( text ) {
	return text.replace( /<br.*?>\s*<.*?br.*?>/gm, "</p><p>" );
}
