/** @module stringProcessing/countWords */

var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Calculates the wordcount of a certain text.
 *
 * @param {Paper} paper The paper to use for the word count.
 * @returns {int} The word count of the given text.
 */
module.exports = function( paper ) {

	var text = stripTags( paper.getText() );
	text = stripSpaces( text );
	if ( text === "" ) {
		return 0;
	}

	return text.split( /\s/g ).length;
};
