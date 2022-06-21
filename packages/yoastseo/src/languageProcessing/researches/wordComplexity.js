import getWords from "../helpers/word/getWords.js";
import getSentences from "../helpers/sentence/getSentences.js";
import { flatMap } from "lodash-es";

/**
 * Checks if a word is complex.
 *
 * @param {string} word     The word to check.
 * @param {object} config   The config to use.
 *
 * @returns {boolean}    Whether or not a word is complex.
 */
const checkIfWordIsComplex = function( word, config ) {
	const lengthLimit = config.wordLength;
	const frequencyList = config.frequencyList;
	// Whether uppercased beginning of a word decreases its complexity.
	const doesUpperCaseDecreaseComplexity = config.doesUpperCaseDecreasesComplexity;

	let isWordComplex = false;
	if ( frequencyList.length === 0 ) {
		return;
	}
	/*
	 * Check for each word whether it is a complex word or not.
	 * A word is complex if:
	 * its length is longer than the limit, AND
	 * the word is not in the frequency list, AND
	 * if the word does NOT start with a capital letter
	 * (for languages that see long words to be less complex if they start with a capital letter)
	 */
	if ( word.length > lengthLimit ) {
		if ( ! frequencyList.includes( word ) ) {
			if ( doesUpperCaseDecreaseComplexity === true && word[ 0 ].toLowerCase() === word[ 0 ] ) {
				isWordComplex = true;
			}
		}
	}
	return isWordComplex;
};


/**
 * Gets the complex word, along with the index for the sentence.
 *
 * @param {string} sentence  The sentence to get wordComplexity from.
 * @param {Object} config    The config to pass
 *
 * @returns {Array} An array of complex word objects containing the  word, the index and the complexity of the word.
 */
const getComplexWords = function( sentence, config ) {
	const words = getWords( sentence );
	const results = [];

	words.forEach( word => {
		if ( checkIfWordIsComplex( word, config ) ) {
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
	const totalComplexWords = flatMap( complexWordsResults, result => {
		if ( result ) {
			return result.complexWords;
		}
		return "";
	} );
	const percentage = ( totalComplexWords.length / words.length ) * 100;

	return +percentage.toFixed( 2 );
};

/**
 * Gets the complex words from the sentences and calculates the percentage of complex words compared to the total words in the text.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {Object} The complex words found in the text and their percentage compared to the total words in the text.
 */
export default function wordComplexity( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const wordComplexityConfig = researcher.getConfig( "wordComplexity" );

	const text = paper.getText();
	const sentences = getSentences( text, memoizedTokenizer );
	const words = getWords( text );
	// Only returns the complex words of the sentence.
	let results = sentences.map( sentence => {
		return {
			complexWords: getComplexWords( sentence, wordComplexityConfig ),
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

