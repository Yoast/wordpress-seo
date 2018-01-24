var wordCountInText = require( "./wordCountInText.js" );
var imageCount = require( "./imageCountInText.js" );

module.exports = function( paper ) {
	var numberOfWords = wordCountInText( paper );
	var numberOfImages = imageCount( paper );

	var readingTime = Math.round( ( numberOfWords / 200 ) + ( numberOfImages * 0.2 ) );

	return readingTime ;
}

