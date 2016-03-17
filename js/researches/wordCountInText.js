var wordCount = require( "./stringProcessing/countWords.js" );

/**
 * Count the words in the text
 * @param {Paper} paper The Paper object who's
 * @returns {number} The amount of words found in the text.
 */
var wordCountInText = function( paper ) {
	return wordCount( paper.getText() );
};

module.export = wordCountInText;
