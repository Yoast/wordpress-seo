import getWords from "../helpers/word/getWords.js";
import getSentences from "../helpers/sentence/getSentences.js";

const checkIfWordIsComplex = function( word, config ) {
	const lengthLimit = config.wordLength;
	const frequencyList = config.frequencyList;
	const canStartWithUpperCase = config.canStartWithUpperCase;
	let isWordComplex = false;
	// Check for each word whether it is a complex word or not.
	// A word is complex if its length is longer than the limit, AND the word is not in the frequency list, AND
	// If word does NOT start with a capital letter.
	if ( word.length > lengthLimit && ! frequencyList.contains( word ) ) {
		if ( canStartWithUpperCase === false && word[ 0 ].toLowerCase() === word[ 0 ] ) {
			isWordComplex = true;
		}
	}
	return isWordComplex;
};


/**
 * Gets the complexity per word, along with the index for the sentence.
 *
 * @param {string} sentence     The sentence to get wordComplexity from.
 * @param {Object} config    The config to pass
 *
 * @returns {Array} A list with words, the index and the complexity per word.
 */
const getComplexWords = function( sentence, config ) {
	const words = getWords( sentence );
	const results = [];

	words.forEach( ( word, i ) => {
		results.push( {
			word: word,
			wordIndex: i,
			complexity: checkIfWordIsComplex( word, config ),
		} );
	} );

	return results;
};

const calculateComplexWordsPercentage = function( complexWordsResults, totalWords ) {
	const totalComplexWords = [];
	// [ {words: [{word:,}]}
	complexWordsResults.forEach( result => {
		const complexWords = result.words.filter( word => word.complexity === true );
		return complexWords.forEach( word => totalComplexWords.push( word.word ) );
	} );

	return ( totalComplexWords / totalWords ) * 100;
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
	const wordComplexityConfig = researcher.getConfig( "wordComplexity" );

	const text = paper.getText();
	const sentences = getSentences( text, memoizedTokenizer );
	const totalWords = getWords( text );
	// Calculate the total complex word.

	const results = sentences.map( sentence => {
		return {
			words: getComplexWords( sentence, wordComplexityConfig ),
			sentence: sentence,
		};
	} );

	// Calculate the percentage of the complex word.
	const percentage = calculateComplexWordsPercentage( results, totalWords );

	return {
		complexWords: results,
		percentage: percentage,
	};
}

