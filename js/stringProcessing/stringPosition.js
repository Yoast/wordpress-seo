/**
 * Checks the position of the keyword in a string.
 *
 * @param {String} text The text to use for matching.
 * @param {String} keyword The keyword to match in text.
 * @returns {Int} The position of the keyword, -1 if not found.
 */
module.exports = function( text, keyword ) {
	if ( typeof text !== "undefined" ) {
		return text.indexOf( keyword );
	}
};
