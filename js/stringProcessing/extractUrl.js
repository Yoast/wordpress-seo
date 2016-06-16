/**
 * Retrieves all URLs from a string, based on the found anchors.
 *
 * @param {string} string The string to match against.
 * @returns {Array} Array containing all the found URLs
 */
module.exports = function( string ) {
	var matched;
	var matches = [];
	var regex = /href=(["'])([^"']+)\1/ig;

	while( ( matched = regex.exec( string ) ) !== null ) {
		matches.push( matched );
	}

	return matches;
};
