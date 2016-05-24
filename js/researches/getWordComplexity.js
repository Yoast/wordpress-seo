var getWords = require( "../stringProcessing/getWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );

/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The amount of words found in the text.
 */
module.exports = function( paper ) {
	var words = getWords( paper.getText() );
	var wordComplexity = [];
	words.map( function( word ) {
		wordComplexity.push( { word: word, complexity: countSyllables( word ) } );
	} );
	return wordComplexity;
};

