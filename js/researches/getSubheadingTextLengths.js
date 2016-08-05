var getSubheadingTexts = require( "../stringProcessing/getSubheadingTexts.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();

	var matches = getSubheadingTexts( text );

	var subHeadingTexts = [];
	forEach( matches, function( subHeading ) {

		subHeadingTexts.push( {
			text: subHeading,
			wordCount: countWords( subHeading ),
		} );
	} );
	return subHeadingTexts;
};

