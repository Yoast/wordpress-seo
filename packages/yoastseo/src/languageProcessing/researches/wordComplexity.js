import { flatMap } from "lodash-es";
import { languageProcessing } from "yoastseo";

const { getWords, getSentences } = languageProcessing;

/**
 * Gets the complex word, along with the index for the sentence.
 *
 * @param {string} sentence  The sentence to get wordComplexity from.
 * @param {function} complexWordsHelper A helper to check if a word is complex.
 * @param {object} wordComplexityConfig The config needed for assessing the word complexity.
 *
 * @returns {Array} An array of complex word objects containing the  word, the index and the complexity of the word.
 */
const getComplexWords = function( sentence, complexWordsHelper, wordComplexityConfig ) {
	const words = getWords( sentence );
	const results = [];

	words.forEach( word => {
		if ( complexWordsHelper( wordComplexityConfig, word ) ) {
			results.push( word );
		}
	} );

	return results;
};

/**
 * Calculates the percentage of the complex words compared to the total words in the text.
 *
 * @param {Array} complexWordsResults The array of complex words object. The structure of the data is:
 * [
 *  { complexWords: ["word1", "word2", "word3" ],
 *    sentence: "the sentence"
 *  },
 *  { complexWords: ["word1", "word2", "word3" ],
 *    sentence: "the sentence"
 *  }
 * ]
 * @param {Array} words    The array of words retrieved from the text.
 * @returns {number}    The percentage of the complex words compared to the total words in the text.
 */
const calculateComplexWordsPercentage = function( complexWordsResults, words ) {
	const totalComplexWords = flatMap( complexWordsResults, result =>  result.complexWords );
	const percentage = ( totalComplexWords.length / words.length ) * 100;

	/* If the number is a decimal, round it to two numbers after the period, e.g. 5.12345 -> 5.12.
	This approach is inspired from this thread: https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary.
	*/
	return +percentage.toFixed( 2 );
};

/**
 * Gets the complex words from the sentences and calculates the percentage of complex words compared to the total words in the text.
 * This is a research for a premium assessment Word Complexity assessment.
 * As such, this research will not be bundled in AbstractResearcher and is loaded from the premium repository.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {Object} The complex words found in the text and their percentage compared to the total words in the text.
 */
export default function wordComplexity( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const wordComplexityHelper = researcher.getHelper( "checkIfWordIsComplex" );
	const wordComplexityConfig = researcher.getConfig( "wordComplexity" );

	const text = paper.getText();
	const sentences = getSentences( text, memoizedTokenizer );
	const words = getWords( text );
	// Only returns the complex words of the sentence.
	let results = sentences.map( sentence => {
		return {
			complexWords: getComplexWords( sentence, wordComplexityHelper, wordComplexityConfig ),
			sentence: sentence,
		};
	} );

	results = results.filter( result => result.complexWords.length !== 0 );

	// Calculate the percentage of the complex words.
	const percentage = calculateComplexWordsPercentage( results, words );

	return {
		complexWords: results,
		percentage: percentage,
	};
}

