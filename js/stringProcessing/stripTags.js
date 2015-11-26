/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
module.exports = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	return text;
};
