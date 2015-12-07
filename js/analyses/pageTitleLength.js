/**
 * Checks the length of the pageTitle
 *
 * @param {String} text The text to return the length from.
 * @returns {Int} textlength.
 */
module.exports = function( text ) {
	if ( typeof text !== "undefined" ) {
		return text.length;
	}
};
