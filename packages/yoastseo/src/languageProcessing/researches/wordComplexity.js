import getWords from "../helpers/word/getWords.js";
import countSyllables from "../helpers/syllables/countSyllables.js";
import getSentences from "../helpers/sentence/getSentences.js";

import { map } from "lodash-es";
import { forEach } from "lodash-es";

/**
 * Gets the complexity per word, along with the index for the sentence.
 *
 * @param {string} sentence     The sentence to get wordComplexity from.
 * @param {Object} syllables    The syllables data.
 *
 * @returns {Array} A list with words, the index and the complexity per word.
 */
const getWordComplexityForSentence = function( sentence, syllables ) {
	const words = getWords( sentence );
	const results = [];

	forEach( words, function( word, i ) {
		results.push( {
			word: word,
			wordIndex: i,
			complexity: countSyllables( word, syllables ),
		} );
	} );

	return results;
};

/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {Object} The words found in the text with the number of syllables.
 */
export default function wordComplexity( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );

	const sentences = getSentences( paper.getText(), memoizedTokenizer );
	const syllables = researcher.getConfig( "syllables" );

	return map( sentences, function( sentence ) {
		return {
			sentence: sentence,
			words: getWordComplexityForSentence( sentence, syllables ),
		};
	} );
}
