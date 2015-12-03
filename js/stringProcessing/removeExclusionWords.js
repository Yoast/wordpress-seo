var syllableArray = require( "../config/syllables.js" );
var arrayToRegex = require( "../stringProcessing/arrayToRegex.js" );

/**
 * Removes words from the text that are in the exclusion array. These words are counted
 * incorrectly in the syllable counters, so they are removed and checked sperately.
 *
 * @param text
 * @returns {*}
 */
module.exports = function( text ){
	var exclusionWords = syllableArray().exclusionWords;
	var regex = arrayToRegex ( exclusionWords );
	text = text.replace( regex, "" );

	return text;
};
