var arrayToRegexFunction = require( "../stringProcessing/arrayToRegex.js" );
var syllableArray = require( "../config/syllables.js" );

/**
 * Advanced syllable counter to match texstring with regexes.
 *
 * @param {String} text The text to count the syllables.
 * @param {String} operator The operator to determine which regex to use.
 * @returns {number} the amount of syllables found in string.
 */
module.exports = function( text, operator ) {
	var matches, count = 0, array = text.split( " " );
	var regex = "";
	switch ( operator ) {
		case "add":
			regex = arrayToRegexFunction( syllableArray().addSyllables, true );
			break;
		case "subtract":
			regex = arrayToRegexFunction( syllableArray().subtractSyllables, true );
			break;
		default:
			break;
	}
	for ( var i = 0; i < array.length; i++ ) {
		matches = array[i].match ( regex );
		if ( matches !== null ) {
			count += matches.length;
		}
	}
	return count;
};
