/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text The text to match the
 * @param {String} regexString A string to use as regex.
 * @returns {Array} Array with matches, empty array if no matches found.
 */
module.exports = function( text, regexString ){
	var matches;
	var regex = new RegExp( regexString, "ig" );
	matches = text.match( regex );
	if ( matches === null ) {
		matches = [];
	}
	return matches;
};
