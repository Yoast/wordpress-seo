/** @module stringProcessing/getStringPosition */

/**
 * Checks the position of the keyword in a string.
 *
 * @param {string} text The text to use for matching.
 * @param {string} keyword The keyword to match in text.
 * @returns {number} The position of the keyword, -1 if not found.
 */
module.exports = function( text, keyword ) {
	if ( typeof text !== "undefined" ) {
		return text.toLocaleLowerCase().indexOf( keyword );
	}
};
