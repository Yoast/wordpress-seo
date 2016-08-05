var getWords = require( "../stringProcessing/getWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );

var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the complexity per word, along with the index for the sentence.
 * @param {string} sentence The sentence to get wordComplexity from.
 * @returns {Array} A list with words, the index and the complexity per word.
 */
var getWordComplexityForSentence = function( sentence ) {
	var words = getWords( sentence );
	var results = [];

	forEach( words, function( word, i ) {
		results.push( {
			word: word,
			wordIndex: i,
			complexity: countSyllables( word ),
		} );
	} );

	return results;
};

/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The words found in the text with the number of syllables.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );

	return map( sentences, function( sentence ) {
		return {
			sentence: sentence,
			words: getWordComplexityForSentence( sentence ),
		};
	} );
};

