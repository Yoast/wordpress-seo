var cleanText = require( "../stringProcessing/cleanText.js" );

/**
 * Returns sentences in a string.
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function( text ) {
	var cleanedText = cleanText( text );
	return cleanedText.split( "." );
};
