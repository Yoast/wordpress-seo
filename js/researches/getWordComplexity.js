var getWords = require( "../stringProcessing/getWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );

var map = require( "lodash/map" );

/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The words found in the text with the number of syllables.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );

	return map( sentences, function( sentence ) {
		var words = getWords( sentence );

		return {
			sentence: sentence,
			words: words.map( function( word, i ) {
				return {
					word: word,
					wordIndex: i,
					complexity: countSyllables( word )
				};
			} )
		};
	} );
};

