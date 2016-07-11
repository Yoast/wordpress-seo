/** @module stringProcessing/unifyWhitespace */

/**
 *
 * @param text
 * @returns {string|void|*|XML}
 */
var unifyNonBreakingSpace = function( text ) {
	return text.replace( /&nbsp;/g, " " );
};

/**
 *
 * @param text
 * @returns {string|void|*|XML}
 */
var unifyWhiteSpace = function( text ) {
	return text.replace( /\s/g, " " );
};

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 * @returns {string} The text with unified spaces.
 */
var unifyAllSpaces = function( text ) {
	text = unifyNonBreakingSpace( text );
	return unifyWhiteSpace( text );
};

module.exports = {
	unifyNonBreakingSpace: unifyNonBreakingSpace,
	unifyWhiteSpace: unifyWhiteSpace,
	unifyAllSpaces: unifyAllSpaces
};
