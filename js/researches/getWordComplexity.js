var getWords = require( "../stringProcessing/getWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );

/**
 * Calculates the complexity of words in a text
 * @param {Paper} paper The Paper object who's
 * @returns {number} The amount of words found in the text.
 */
module.exports = function( paper ) {
	var words = getWords( paper.getText() );
	var syllablesPerWord = [];
 	words.map( function( word ) {
		syllablesPerWord.push( countSyllables( word ) );
	} );
	return syllablesPerWord;
};

