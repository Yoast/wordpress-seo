import getWords from "../helpers/word/getWords.js";
import getSentences from "../helpers/sentence/getSentences.js";
import { flatMap } from "lodash-es";

/**
 * An object containing the results of the complex words research for a single sentence.
 *
 * The structure of the data is:
 * @example
 * {
 * complexWords: ["word1", "word2", "word3" ],
 * sentence: "the sentence"
 * }
 *
 * @typedef {Object} 	ComplexWordsResult
 * @property {string[]}	complexWords	The complex words in the sentence.
 * @property {string}	sentence		The sentence.
 */

/**
 * Retrieves all complex words in a sentence.
 *
 * @param {string} 		currentSentence	The current sentence.
 * @param {Researcher} 	researcher		The researcher object.
 *
 * @returns {ComplexWordsResult} An object containing all complex words in a given sentence.
 */
const getComplexWords = function( currentSentence, researcher ) {
	const checkIfWordIsComplex = researcher.getHelper( "checkIfWordIsComplex" );
	const functionWords = researcher.getConfig( "functionWords" );
	const checkIfWordIsFunction = researcher.getHelper( "checkIfWordIsFunction" );

	const allWords = getWords( currentSentence );
	// Filters out function words because function words are not complex.
	// Words are converted to lower case before processing to avoid excluding functional words what starts with a capital latter.
	const words = allWords.filter( word => ! ( checkIfWordIsFunction ? checkIfWordIsFunction( word ) : functionWords.includes( word ) ) );
	const results = [];

	words.forEach( word => {
		if ( checkIfWordIsComplex( word ) ) {
			results.push( word );
		}
	} );

	return {
		complexWords: results,
		sentence: currentSentence,
	};
};

/**
 * Calculates the percentage of the complex words compared to the total words in the text.
 *
 * @param {ComplexWordsResult[]}	complexWordsResults	The array of complex words results.
 * @param {string[]} 				words    			The array of words retrieved from the text.
 *
 * @returns {number} The percentage of the complex words compared to the total words in the text.
 */
const calculateComplexWordsPercentage = function( complexWordsResults, words ) {
	const totalComplexWords = flatMap( complexWordsResults, result => result.complexWords );
	const percentage = ( totalComplexWords.length / words.length ) * 100;

	// If the number is a decimal, round it to two numbers after the period, e.g. 5.12345 -> 5.12.
	// This approach is inspired from this thread: https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary.
	return +percentage.toFixed( 2 );
};

/**
 * Gets the complex words from the sentences and calculates the percentage of complex words compared to the total words in the text.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {{complexWords: ComplexWordsResult[], percentage: number}}
 * The complex words found and their percentage compared to the total words in the text.
 */
export default function wordComplexity( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const text = paper.getText();
	const sentences = getSentences( text, memoizedTokenizer );

	// Find the complex words in each sentence.
	let results = sentences.map( sentence => getComplexWords( sentence, researcher ) );

	// Remove sentences without complex words.
	results = results.filter( result => result.complexWords.length !== 0 );

	// Calculate the percentage of complex words in the text as a whole.
	const words = getWords( text );
	const percentage = calculateComplexWordsPercentage( results, words );

	return {
		complexWords: results,
		percentage: percentage,
	};
}

