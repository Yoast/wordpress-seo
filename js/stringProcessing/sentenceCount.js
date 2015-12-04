var cleanTextFunction = require( "../stringProcessing/cleanText.js" );

/**
 * Counts the number of sentences in a given string.
 *
 * @param {String} text The text used to count sentences.
 * @returns {*}
 */
module.exports = function( text ) {
	var sentences = cleanTextFunction( text ).split( "." );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		if ( sentences[ i ] !== "" && sentences[ i ] !== " " ) {
			sentenceCount++;
		}
	}
	return sentenceCount;
};
