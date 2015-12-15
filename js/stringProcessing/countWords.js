var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Calculates the wordcount of a certain text.
 *
 * @param {String} text The text to count words in.
 * @returns {int} The wordcount of the given text.
 */
module.exports = function( text ) {

	text = stripTags( text );
	text = stripSpaces( text );
	if ( text === "" ) {
		return 0;
	}

	return text.split( /\s/g ).length;
};
