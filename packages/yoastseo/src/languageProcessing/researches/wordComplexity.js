import { flatMap, get } from "lodash";

import getSentences from "../helpers/sentence/getSentences";
import getWords from "../helpers/word/getWords";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers/sanitize/filterShortcodesFromTree";

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
	const language = researcher.getConfig( "language" );
	const checkIfWordIsComplex = researcher.getHelper( "checkIfWordIsComplex" );
	const functionWords = researcher.getConfig( "functionWords" );
	const wordComplexityConfig = researcher.getConfig( "wordComplexity" );
	const checkIfWordIsFunction = researcher.getHelper( "checkIfWordIsFunction" );
	const premiumData = get( researcher.getData( "morphology" ), language, false );

	const allWords = getWords( currentSentence );

	// Filters out function words because function words are not complex.
	// Words are converted to lowercase before processing to avoid excluding function words that start with a capital letter.
	const words = allWords.filter( word => ! ( checkIfWordIsFunction ? checkIfWordIsFunction( word ) : functionWords.includes( word ) ) );

	/**
	 * Matches forms of words in the keyphrase against the complex words.
	 *
	 * @param {Object}      topicForms       The object with word forms of all (content) words from the keyphrase and eventually synonyms,
	 * comes in a shape {
	 *                     keyphraseForms: [[ form1, form2, ... ], [ form1, form2, ... ]],
	 *                     synonymsForms: [
	 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
	 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
	 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
	 *                     ],
	 *                  }
	 * @param {string}      text                    The string to match the word forms against.
	 * @param {boolean}     useSynonyms             Whether to use synonyms as if it was keyphrase or not (depends on the assessment).
	 * @param {string}      locale                  The locale of the paper.
	 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
	 *
	 * @returns {array} Words with the keyphrases filtered out if a full match was found with the keyword.
	 */
	const findTopicFormsInString = function (topicForms, text, useSynonyms, locale, matchWordCustomHelper) {
		// First check if the keyword is found in the text
		const matchedTopicForms = ( findTopicFormsInString )( topicForms, text, useSynonyms, locale, matchWordCustomHelper );

		// If a full match found with the keyword form, filter out keyphrase forms because they are allowed to be complex.
		if (result.percentWordMatches === 100) ( topicForms.keyphraseForms )
		{
			return words.filter( word => ! ( findTopicFormsInString ? findTopicFormsInString( topicForms, text, useSynonyms, locale, matchWordCustomHelper ) : matchedTopicForms.includes( word ) ) );
		}
	}

	const result = {
		complexWords: [],
		sentence: currentSentence,
	};

	if ( ! premiumData ) {
		return result;
	}

	words.forEach( word => {
		if ( checkIfWordIsComplex( wordComplexityConfig, word, premiumData ) ) {
			result.complexWords.push( word );
		}
	} );

	return result;
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
 * This is a research for the Word Complexity assessment. As such, this research is not part of the AbstractResearcher, and not bundled in Yoast SEO.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {{complexWords: ComplexWordsResult[], percentage: number}}
 * The complex words found and their percentage compared to the total words in the text.
 */
export default function wordComplexity( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	let text = paper.getText();
	text = removeHtmlBlocks( text );
	text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );
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

