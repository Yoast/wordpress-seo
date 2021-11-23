import { memoize } from "lodash-es";
import { uniq } from "lodash-es";

import getWords from "../word/getWords";
import { normalizeSingle } from "../sanitize/quotes";
import ProminentWord from "../../values/ProminentWord";

const specialCharacters = /[1234567890‘’“”"'.…?!:;,¿¡«»&*@#±^%$|~=+§`[\](){}⟨⟩<>/\\–\-\u2014\u00d7\s]/g;

/**
 * Returns only those prominent words that occur more than a certain number of times and do not consist of special characters.
 *
 * @param {ProminentWord[]} prominentWords A list of prominent words.
 * @param {int} [minimalNumberOfOccurrences] A minimal number of occurrences that is needed for a relevant prominentWord, default 2.
 *
 * @returns {ProminentWord[]} Only relevant words.
 */
function filterProminentWords( prominentWords, minimalNumberOfOccurrences = 2 ) {
	prominentWords = prominentWords.filter( function( word ) {
		return (
			word.getOccurrences() >= minimalNumberOfOccurrences &&
			word.getWord().replace( specialCharacters, "" ) !== ""
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
		// The word with the highest number of occurrences comes first.
		if ( difference !== 0 ) {
			return difference;
		}

		// In case of a tie on occurrence number, the alphabetically first word comes first.
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
		 * If they are equal, the word should be collapsed.
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
 * @param {Function} stemmer        The available stemmer.
 * @param {Array} functionWords     The available function words list.
 *
 * @returns {ProminentWord[]} All prominent words sorted and filtered for this text.
 */
function computeProminentWords( words, abbreviations, stemmer, functionWords ) {
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
				stemmer( word ),
				words.filter( element => element === word ).length
			) );
		}
	} );

	return collapseProminentWordsOnStem( prominentWords );
}

/**
 * Caches prominent words depending on text words.
 * Only the words and abbreviations are used as the cache key as the stemmer and function words
 * are config and shouldn't change in the scope of one request.
 *
 * @param {string[]} words          The words to determine relevance for.
 * @param {string[]} abbreviations  Abbreviations that should not be stemmed.
 * @param {Function} stemmer        The available stemmer.
 * @param {Array} functionWords     The available function words list.
 *
 * @returns {function} The function that collects prominent words for a given set of text words, language and morphologyData.
 */
const computeProminentWordsMemoized = memoize( ( words, abbreviations, stemmer, functionWords ) => {
	return computeProminentWords( words, abbreviations, stemmer, functionWords );
}, ( words, abbreviations ) => {
	return words.join( "," ) + "," + abbreviations.join( "," );
} );


/**
 * Gets prominent words from the paper text.
 *
 * @param {string} text             The text to retrieve the prominent words from.
 * @param {string[]} abbreviations  The abbreviations that occur in the text and attributes of the paper.
 * @param {Function} stemmer        The available stemmer.
 * @param {Array} functionWords     The available function words list.
 * @param {function} getWordsCustomHelper   The custom helper to get words.
 *
 * @returns {ProminentWord[]} All prominent words sorted and filtered for this text.
 */
function getProminentWords( text, abbreviations, stemmer, functionWords, getWordsCustomHelper ) {
	if ( text === "" ) {
		return [];
	}

	const words = getWordsCustomHelper
		? getWordsCustomHelper( normalizeSingle( text ).toLocaleLowerCase() )
		: getWords( normalizeSingle( text ).toLocaleLowerCase() );

	return computeProminentWordsMemoized( words, abbreviations, stemmer, functionWords );
}

/**
 * Gets prominent words from keyphrase and synonyms, metadescription, title, and subheadings.
 *
 * @param {string[]} attributes     The array with attributes to process.
 * @param {string[]} abbreviations  The abbreviations that occur in the text and attributes of the paper.
 * @param {Function} stemmer        The available stemmer.
 * @param {Array} functionWords     The available function words list.
 * @param {function} getWordsCustomHelper   The custom helper to get words.
 *
 * @returns {ProminentWord[]} Prominent words from the paper attributes.
 */
function getProminentWordsFromPaperAttributes( attributes, abbreviations, stemmer, functionWords, getWordsCustomHelper ) {
	const wordsFromAttributes = getWordsCustomHelper
		? getWordsCustomHelper( attributes.join( " " ).toLocaleLowerCase() )
		: getWords( attributes.join( " " ).toLocaleLowerCase() );

	return computeProminentWords( wordsFromAttributes, abbreviations, stemmer, functionWords );
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
