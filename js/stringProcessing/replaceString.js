/** @module stringProcessing/replaceString */

/**
 * Replaces string with a replacement in text
 *
 * @param {string} text The textstring to remove
 * @param {string} stringToReplace The string to replace
 * @param {string} replacement The replacement of the string
 * @returns {string} The text with the string replaced
 */
module.exports = function( text, stringToReplace, replacement ) {
	text = text.replace( stringToReplace, replacement );

	return text;
};
