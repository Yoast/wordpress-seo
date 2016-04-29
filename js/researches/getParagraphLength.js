var countWords = require( "../stringProcessing/countWords.js" );
var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var filter = require( "lodash/filter" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
 * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var paragraphs = matchParagraphs( text );
	var paragraphsLength = [];
	paragraphs.map( function ( paragraph ) {
		paragraphsLength.push( countWords( paragraph ) );
	} );

	return filter ( paragraphsLength, function ( paragraphLength ) {
		return ( paragraphLength > 0 );
	} );
};
