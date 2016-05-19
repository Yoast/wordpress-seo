/**
 * Marks a text with HTML tags
 *
 * @param {string} text The unmarked text.
 * @returns {string} The marked text.
 */
module.exports = function( text ) {
	return "<mark>" + text + "</mark>";
};
