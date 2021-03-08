import { get } from "lodash-es";
import { memoize } from "lodash-es";
import { uniq } from "lodash-es";
import retrieveStemmer from "../helpers/retrieveStemmer";

import getWords from "../stringProcessing/getWords";
import { normalizeSingle } from "../stringProcessing/quotes";
import ProminentWord from "../values/ProminentWord";
import functionWordListsFactory from "../helpers/getFunctionWords";

const functionWordLists = functionWordListsFactory();
const specialCharacters = /[1234567890‘’“”"'.…?!:;,¿¡«»&*@#±^%$|~=+§`[\](){}⟨⟩<>/\\–\-\u2014\u00d7\s]/g;

/**
 * Returns only those prominent words that occur more than a certain number of times and do not consist of special characters.
 *
 * @param {ProminentWord[]} prominentWords A list of prominent words.
 * @param {int} [minimalNumberOfOccurrences] A minimal number of occurrences that is needed for a relevant prominentWord, default 2.
 *
 * @returns {ProminentWord[]} Only relevant word combinations.
 */
function filterProminentWords( prominentWords, minimalNumberOfOccurrences = 2 ) {
	prominentWords = prominentWords.filter( function( combination ) {
		return (
			combination.getOccurrences() >= minimalNumberOfOccurrences &&
			combination.getWord().replace( specialCharacters, "" ) !== ""
		);
	} );
	return prominentWords;
}

/**
 * Sorts prominent words based on their number of occurrences and length.
 *
 * @param {ProminentWord[]} prominentWords The prominent words to sort.
 *
 * @returns {void}
 */
function sortProminentWords( prominentWords ) {
	prominentWords.sort( function( wordA, wordB ) {
		const difference = wordB.getOccurrences() - wordA.getOccurrences();
		// The combination with the highest number of occurrences comes first.
		if ( difference !== 0 ) {
			return difference;
		}

		// In case of a tie on occurrence number, the alphabetically first combination comes first.
		return wordA.getStem().localeCompare( wordB.getStem() );
	} );
}

/**
 * Collapses prominent words that have the same stem.
 *
 * @param {ProminentWord[]} prominentWords All prominentWords.
 *
 * @returns {ProminentWord[]} The original array with collapsed duplicates.
 */
function collapseProminentWordsOnStem( prominentWords ) {
	if ( prominentWords.length === 0 ) {
		return [];
	}

	// Sort the input array by stem
	prominentWords.sort( function( wordA, wordB ) {
		return wordA.getStem().localeCompare( wordB.getStem() );
	} );

	const collapsedProminentWords = [];
	let previousWord = new ProminentWord(
		prominentWords[ 0 ].getWord(),
		prominentWords[ 0 ].getStem(),
		prominentWords[ 0 ].getOccurrences()
	);

	for ( let i = 1; i < prominentWords.length; i++ ) {
		const currentWord = new ProminentWord(
			prominentWords[ i ].getWord(),
			prominentWords[ i ].getStem(),
			prominentWords[ i ].getOccurrences()
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

			if ( currentWord.getWord() === previousWord.getStem() || currentWord.getWord().toLocaleLowerCase() === previousWord.getStem() ) {
				previousWord.setWord( currentWord.getWord() );
			}
		} else {
			collapsedProminentWords.push( previousWord );
			previousWord = currentWord;
		}
	}

	collapsedProminentWords.push( previousWord );

	return collapsedProminentWords;
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
 * Retrieves a list of all abbreviations from the text. Returns an empty array if the input text is empty.
 *
 * @param {string} text A text.
 *
 * @returns {string[]} A list of abbreviations from the list.
 */
function retrieveAbbreviations( text ) {
	const words = getWords( normalizeSingle( text ) );
	const abbreviations = [];

	words.forEach( function( word ) {
		if ( word.length > 1 && word.length < 5 && word === word.toLocaleUpperCase() ) {
			abbreviations.push( word.toLocaleLowerCase() );
		}
	} );

	return uniq( abbreviations );
}

/**
 * Computes prominent words from an array of words. In order to do so, checks whether the word is included in the list of
 * function words and determines the number of occurrences for every word. Then checks if any two words have the same stem
 * and if so collapses over them.
 *
 * @param {string[]} words          The words to determine relevance for.
 * @param {string[]} abbreviations  Abbreviations that should not be stemmed.
 * @param {string} language         The paper's language.
 * @param {Object} morphologyData   The morphologyData available for the language of the paper.
 *
 * @returns {ProminentWord[]} All prominent words sorted and filtered for this text.
 */
function computeProminentWords( words, abbreviations, language, morphologyData ) {
	const functionWords = retrieveFunctionWords( language );
	const determineStem = retrieveStemmer( language, morphologyData );

	if ( words.length === 0 ) {
		return [];
	}

	const uniqueContentWords = uniq( words.filter( word => ! functionWords.includes( word.trim() ) ) );
	const prominentWords = [];

	uniqueContentWords.forEach( function( word ) {
		if ( abbreviations.includes( word ) ) {
			prominentWords.push( new ProminentWord(
				word.toLocaleUpperCase(),
				word,
				words.filter( element => element === word ).length
			) );
		} else {
			prominentWords.push( new ProminentWord(
				word,
				determineStem( word, morphologyData ),
				words.filter( element => element === word ).length
			) );
		}
	} );

	return collapseProminentWordsOnStem( prominentWords );
}

/**
 * Caches prominent words depending on the currently available morphologyData and (separately) text words and language.
 * In this way, if the morphologyData remains the same in multiple calls of this function, the function
 * that collects actual prominent words only needs to check if the text words and language also remain the
 * same to return the cached result. The joining of words and language for this function is needed,
 * because by default memoize caches by the first key only, which in the current case would mean that the function would
 * return the cached forms if the text has not changed (without checking if language was changed).
 *
 * @param {Object|boolean}  morphologyData  The available morphology data.
 *
 * @returns {function} The function that collects prominent words for a given set of text words, language and morphologyData.
 */
const primeProminentWords = memoize( ( morphologyData ) => {
	return memoize( ( words, abbreviations, language ) => {
		return computeProminentWords( words, abbreviations, language, morphologyData );
	}, ( words, abbreviations, language ) => {
		return words.join( "," ) + "," + abbreviations.join( "," ) + "," + language;
	} );
} );


/**
 * Gets prominent words from the paper text.
 *
 * @param {string}      text            The text to retrieve the prominent words from.
 * @param {string[]}    abbreviations   The abbreviations that occur in the text and attributes of the paper.
 * @param {string}      language        The paper's language.
 * @param {Object}      morphologyData  The morphologyData available for the language of the paper.
 *
 * @returns {ProminentWord[]} All prominent words sorted and filtered for this text.
 */
function getProminentWords( text, abbreviations, language, morphologyData ) {
	if ( text === "" ) {
		return [];
	}

	const words = getWords( normalizeSingle( text ).toLocaleLowerCase() );
	const computeProminentWordsMemoized = primeProminentWords( morphologyData );

	return computeProminentWordsMemoized( words, abbreviations, language, morphologyData );
}

/**
 * Gets prominent words from keyphrase and synonyms, metadescription, title, and subheadings.
 *
 * @param {string[]}    attributes       The array with attributes to process.
 * @param {string[]}    abbreviations    The abbreviations that occur in the text and attributes of the paper.
 * @param {string}      language         The language of the paper.
 * @param {Object}      morphologyData   The morphologyData available for the language of the paper.
 *
 * @returns {ProminentWord[]} Prominent words from the paper attributes.
 */
function getProminentWordsFromPaperAttributes( attributes, abbreviations, language, morphologyData ) {
	const wordsFromAttributes = getWords( attributes.join( " " ).toLocaleLowerCase() );

	return computeProminentWords( wordsFromAttributes, abbreviations, language, morphologyData );
}

export {
	getProminentWords,
	getProminentWordsFromPaperAttributes,
	filterProminentWords,
	sortProminentWords,
	collapseProminentWordsOnStem,
	retrieveAbbreviations,
};

export default {
	getProminentWords,
	getProminentWordsFromPaperAttributes,
	filterProminentWords,
	sortProminentWords,
	collapseProminentWordsOnStem,
	retrieveAbbreviations,
};
