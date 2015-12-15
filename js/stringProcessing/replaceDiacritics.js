/** @module stringProcessing/replaceDiacritics */

var diacritisRemovalMap = require( "../config/diacritics.js" );

/**
 * Replaces all diacritics from the text based on the diacriticsremovalmap.
 *
 * @param {string} text The text to remove diacritics from.
 * @returns {string} The text with all diacritics replaced.
 */
module.exports = function( text ) {
	var map = diacritisRemovalMap();

	for ( var i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letters,
			map[ i ].base
		);
	}
	return text;
};
