var wordCountInText = require( "./wordCountInText.js" );
var imageCount = require( "./imageCountInText.js" );

module.exports = function( paper ) {
	var numberOfWords = wordCountInText( paper );
	var numberOfImages = imageCount( paper );

	var text = paper.getText();

	/*
	Total formula:

	 (Total number of words / 200) + (Total number of images x 0.2) + (Total number of code lines x 0.04)

	 */

	// provisional formula:
	var readingTime = ( numberOfWords / 200 ) + ( numberOfImages * 0.2 )


	return readingTime ;
}

