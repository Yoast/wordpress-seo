import { get } from "lodash-es";
import { memoize } from "lodash-es";
import { uniq } from "lodash-es";

import getWords from "../stringProcessing/getWords";
import { normalizeSingle } from "../stringProcessing/quotes";
import WordCombination from "../values/WordCombination";
import functionWordListsFactory from "../helpers/getFunctionWords";
import getStemForLanguageFactory from "../helpers/getStemForLanguage";

const functionWordLists = functionWordListsFactory();
const stemFunctions = getStemForLanguageFactory();
const specialCharacters = /[1234567890‘’“”"'.…?!:;,¿¡«»&*@#±^%$|~=+§`[\](){}⟨⟩<>/\\–\-\u2014\u00d7\s]/g;

/**
 * Returns only the relevant combinations from a list of word combinations.
 *
 * @param {WordCombination[]} wordCombinations A list of word combinations.
 *
 * @returns {WordCombination[]} Only relevant word combinations.
 */
function getRelevantCombinations( wordCombinations ) {
	wordCombinations = wordCombinations.filter( function( combination ) {
		return ( combination.getOccurrences() !== 1 && combination.getWord().replace( specialCharacters, "" ) !== "" );
	} );
	return wordCombinations;
}

/**
 * Sorts word combinations based on their number of occurrences and length.
 *
 * @param {WordCombination[]} wordCombinations The combinations to sort.
 *
 * @returns {void}
 */
function sortCombinations( wordCombinations ) {
	wordCombinations.sort( function( combinationA, combinationB ) {
		const difference = combinationB.getOccurrences() - combinationA.getOccurrences();
		// The combination with the highest number of occurrences comes first.
		if ( difference !== 0 ) {
			return difference;
		}

		// In case of a tie on occurrence number, the alphabetically first combination comes first.
		return combinationA.getStem().localeCompare( combinationB.getStem() );
	} );
}

/**
 * Collapses relevant words that have the same stem.
 *
 * @param {WordCombination[]} wordCombinations All word combinations.
 *
 * @returns {WordCombination[]} The original array with collapsed duplicates.
 */
function collapseRelevantWordsOnStem( wordCombinations ) {
	if ( wordCombinations.length === 0 ) {
		return [];
	}

	// Sort the input array by stem
	wordCombinations.sort( function( wordA, wordB ) {
		return wordA.getStem().localeCompare( wordB.getStem() );
	} );

	const collapsedRelevantWords = [];
	let previousWord = new WordCombination(
		wordCombinations[ 0 ].getWord(),
		wordCombinations[ 0 ].getStem(),
		wordCombinations[ 0 ].getOccurrences()
	);

	for ( let i = 1; i < wordCombinations.length; i++ ) {
		const currentWord = new WordCombination(
			wordCombinations[ i ].getWord(),
			wordCombinations[ i ].getStem(),
			wordCombinations[ i ].getOccurrences()
		);

		/*
		 * Compare the stem of the current word in the loop with the previously available stem.
		 * If they equal, word combinations should be collapsed.
		 * When collapsing, the numbers of occurrences get summed.
		 * If the stem happens to equal the real word that occurred in the text, we can be sure it's ok to display it
		 * to the customer. So, the stem reassigns the word.
		 */
		if ( currentWord.getStem() ===  previousWord.getStem() ) {
			previousWord.setOccurrences( previousWord.getOccurrences() + currentWord.getOccurrences() );

			if ( currentWord.getWord() === previousWord.getStem() ) {
				previousWord.setWord( currentWord.getWord() );
			}
		} else {
			collapsedRelevantWords.push( previousWord );
			previousWord = currentWord;
		}
	}

	collapsedRelevantWords.push( previousWord );

	return collapsedRelevantWords;
}

/**
 * Retrieves a function words list from the factory. Returns an empty array if the language does not have function words.
 *
 * @param {string} language The language to retrieve function words for.
 *
 * @returns {string[]} A list of function words for the language.
 */
function retrieveFunctionWords( language ) {
	return get( functionWordLists, language.concat( ".all" ), [] );
}

/**
 * Retrieves a stemmer function from the factory. Returns the identity function if the language does not have a stemmer.
 *
 * @param {string} language The language to retrieve a stemmer function for.
 *
 * @returns {Function} A stemmer function for the language.
 */
function retrieveStemmer( language ) {
	return get( stemFunctions, language, word => word );
}

/**
 * Computes relevant words from an array of words. In order to do so, checks whether the word is included in the list of
 * function words and determines the number of occurrences for every word. Then checks if any two words have the same stem
 * and if so collapses over them.
 *
 * @param {string[]} words The words to determine relevance for.
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The morphologyData available for the language of the paper.
 *
 * @returns {WordCombination[]} All relevant words sorted and filtered for this text.
 */
function computeRelevantWords( words, language, morphologyData ) {
	const functionWords = retrieveFunctionWords( language );
	const determineStem = retrieveStemmer( language );

	if ( words.length === 0 ) {
		return [];
	}

	const uniqueContentWords = uniq( words.filter( word => ! functionWords.includes( word.trim() ) ) );

	const relevantWords = uniqueContentWords.map(
		word => new WordCombination(
			word,
			determineStem( word, morphologyData ),
			words.filter( element => element === word ).length
		)
	);

	return collapseRelevantWordsOnStem( relevantWords );
}

/**
 * Caches relevant words depending on the currently available morphologyData and (separately) text words and language.
 * In this way, if the morphologyData remains the same in multiple calls of this function, the function
 * that collects actual relevant words only needs to check if the text words and language also remain the
 * same to return the cached result. The joining of words and language for this function is needed,
 * because by default memoize caches by the first key only, which in the current case would mean that the function would
 * return the cached forms if the text has not changed (without checking if language was changed).
 *
 * @param {Object|boolean}  morphologyData  The available morphology data.
 *
 * @returns {function} The function that collects relevant words for a given set of text words, language and morphologyData.
 */
const primeRelevantWords = memoize( ( morphologyData ) => {
	return memoize( ( words, language ) => {
		return computeRelevantWords( words, language, morphologyData );
	}, ( words, language ) => {
		return words.join( "," ) + "," + language;
	} );
} );


/**
 * Gets relevant words from the paper text.
 *
 * @param {string} text The text to retrieve the relevant words of.
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The morphologyData available for the language of the paper.
 *
 * @returns {WordCombination[]} All relevant words sorted and filtered for this text.
 */
function getRelevantWords( text, language, morphologyData ) {
	if ( text === "" ) {
		return [];
	}
	const words = getWords( normalizeSingle( text ).toLocaleLowerCase() );
	const computeRelevantWordsMemoized = primeRelevantWords( morphologyData );

	return computeRelevantWordsMemoized( words, language, morphologyData );
}

/**
 * Gets relevant words from keyphrase and synonyms, metadescription, title, and subheadings.
 *
 * @param {Object} attributes                  The attributes to process
 * @param {string} attributes.keyphrase        The keyphrase of the paper.
 * @param {string} attributes.synonyms         The synonyms of the paper.
 * @param {string} attributes.metadescription  The metadescription of the paper.
 * @param {string} attributes.title            The title of the paper.
 * @param {string[]} attributes.subheadings    The subheadings of the paper.
 * @param {string} language                    The language of the paper.
 * @param {Object} morphologyData              The morphologyData available for the language of the paper.
 *
 * @returns {WordCombination[]} Relevant word combinations from the paper attributes.
 */
function getRelevantWordsFromPaperAttributes( attributes, language, morphologyData ) {
	const { keyphrase, synonyms, metadescription, title, subheadings } = attributes;

	const attributesJoined = normalizeSingle( [ keyphrase, synonyms, metadescription, title, subheadings.join( " " ) ].join( " " ) );

	const wordsFromAttributes = getWords( attributesJoined.toLocaleLowerCase() );

	return computeRelevantWords( wordsFromAttributes, language, morphologyData );
}

export {
	getRelevantWords,
	getRelevantWordsFromPaperAttributes,
	getRelevantCombinations,
	sortCombinations,
	collapseRelevantWordsOnStem,
};

export default {
	getRelevantWords: getRelevantWords,
	getRelevantWordsFromPaperAttributes: getRelevantWordsFromPaperAttributes,
	getRelevantCombinations: getRelevantCombinations,
	sortCombinations: sortCombinations,
	collapseRelevantWordsOnStem: collapseRelevantWordsOnStem,
};
