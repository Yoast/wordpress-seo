import getWords from '../stringProcessing/getWords.js';
import countSyllables from '../stringProcessing/syllables/count.js';
import getSentences from '../stringProcessing/getSentences.js';

import { map } from "lodash-es";
import { forEach } from "lodash-es";

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
export default function( paper ) {
	var sentences = getSentences( paper.getText() );

	return map( sentences, function( sentence ) {
		return {
			sentence: sentence,
			words: getWordComplexityForSentence( sentence ),
		};
	} );
};

