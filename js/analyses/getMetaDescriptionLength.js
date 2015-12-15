/** @module analyses/getMetaDescriptionLength */

/**
 * Returns the length of the metaDescription.
 *
 * @param {string} text Text to check.
 * @returns {number} The length of the text.
 */
module.exports = function( text ) {
	var length = 0;
	if ( typeof text !== "undefined" ) {
		length = text.length;
	}
	return length;
};
