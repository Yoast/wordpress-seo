/** @module analyses/getPageTitleLength */

/**
 * Checks the length of the pageTitle
 *
 * @param {string} text The text to return the length from.
 * @returns {number} textlength.
 */
module.exports = function( text ) {
	if ( typeof text !== "undefined" ) {
		return text.length;
	}
	return 0;
};
