/**
 * Gets all subheadings from the text and returns these in an array.
 * @param {string} text The text to return the headings from.
 * @returns {Array} Array with all headings from the text.
 */
module.exports = function( text ) {
	return text.match( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig );
};
