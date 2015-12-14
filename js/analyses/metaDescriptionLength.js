/**
 * Returns the length of the metaDescription.
 *
 * @param {String} text Text to check.
 * @returns {Int} The length of the text.
 */
module.exports = function( text ) {
	var length = 0;
	if( typeof text !== "undefined" ){
		length = text.length;
	}
	return length;
};
