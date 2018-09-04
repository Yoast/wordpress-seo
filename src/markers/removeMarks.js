/**
 * Removes all marks from a text
 *
 * @param {string} text The marked text.
 * @returns {string} The unmarked text.
 */
export default function( text ) {
	return text
		.replace( new RegExp( "<yoastmark[^>]*>", "g" ), "" )
		.replace( new RegExp( "</yoastmark>", "g" ), "" );
};
