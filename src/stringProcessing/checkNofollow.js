/** @module stringProcessing/checkNofollow */

/**
 * Checks if a links has a nofollow attribute. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} text The text to check against.
 * @returns {string} Returns Dofollow or Nofollow.
 */
module.exports = function( text ) {
	var linkFollow = "Dofollow";

	// Matches all nofollow links, case insensitive and global
	if ( text.match( /\srel=(nofollow(\s|\/>|>)|(\'|\")([^\3]+\s)?nofollow(\s[^\3]+)?\3)/ig ) !== null ) {
		linkFollow = "Nofollow";
	}

	return linkFollow;
};
