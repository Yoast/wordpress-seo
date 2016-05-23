/**
 * Removes all marks from a text
 *
 * @param {string} text The marked text.
 * @returns {string} The unmarked text.
 */
module.exports = function( text ) {
	return text
		.replace( new RegExp( "<yoastmark class='yoast-text-mark'>", "g" ), "" )
		.replace( new RegExp( "</yoastmark>", "g" ), "" );
};
