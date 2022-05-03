/** @module stringProcessing/unifyWhitespace */

/**
 * Replaces a non breaking space with a normal space.
 *
 * @param {string} text The string to replace the non breaking space in.
 *
 * @returns {string} The text with unified spaces.
 */
const unifyNonBreakingSpace = function( text ) {
	return text.replace( /&nbsp;/g, " " );
};

/**
 * Replaces all whitespaces with a normal space.
 *
 * @param {string} text The string to replace the non breaking space in.
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
	return unifyWhiteSpace( text );
};

export {
	unifyNonBreakingSpace,
	unifyWhiteSpace,
	unifyAllSpaces,
};

export default {
	unifyNonBreakingSpace: unifyNonBreakingSpace,
	unifyWhiteSpace: unifyWhiteSpace,
	unifyAllSpaces: unifyAllSpaces,
};
