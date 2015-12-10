/**
 * Converts all whitespace to spaces.
 *
 * @param {String} text The text to replace spaces.
 * @returns {String} The text with unified spaces.
 */

module.exports = function( text ){
	// Replace &nbsp with space
	text = text.replace( "&nbsp;", " " );

	// Replace whitespaces with space
	text = text.replace( /\s/g, " ");

	return text;
};

