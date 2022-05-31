/** @module stringProcessing/unifyWhitespace */

/**
 * Replaces a non-breaking space with a normal space.
 *
 * @param {string} text The string to replace the non-breaking space in.
 *
 * @returns {string} The text with unified spaces.
 */
const unifyNonBreakingSpace = function( text ) {
	return text.replace( /&nbsp;/g, " " );
};

/**
 * Replaces an em dash with a normal space.
 *
 * @param {string} text The string to replace the em dash in.
 *
 * @returns {string} The text with unified spaces.
 */
const unifyEmDash = function( text ) {
	return text.replace( /\u2014/g, " " );
};

/**
 * Replaces all whitespace characters with a normal space.
 *
 * @param {string} text The string to replace the whitespace characters in.
 *
 * @returns {string} The text with unified spaces.
 */
const unifyWhiteSpace = function( text ) {
	return text.replace( /\s/g, " " );
};

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 *
 * @returns {string} The text with unified spaces.
 */
const unifyAllSpaces = function( text ) {
	text = unifyNonBreakingSpace( text );
	text = unifyEmDash( text );
	return unifyWhiteSpace( text );
};

export {
	unifyNonBreakingSpace,
	unifyEmDash,
	unifyWhiteSpace,
	unifyAllSpaces,
};

export default {
	unifyNonBreakingSpace: unifyNonBreakingSpace,
	unifyEmDash: unifyEmDash,
	unifyWhiteSpace: unifyWhiteSpace,
	unifyAllSpaces: unifyAllSpaces,
};
