/**
 * Removes all marks from a text
 * @category Markers
 * @param {string} text The marked text.
 * @returns {string} The unmarked text.
 */
export default function( text ) {
	return text
		.replace( new RegExp( "<yoastmark[^>]*>", "g" ), "" )
		.replace( new RegExp( "</yoastmark>", "g" ), "" );
}
