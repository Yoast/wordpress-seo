import getWords from "../stringProcessing/getWords.js";
import { normalizeSingle } from "../stringProcessing/quotes";
import WordCombination from "../values/WordCombination.js";
import functionWordListsFactory from "../helpers/getFunctionWords.js";
const functionWordLists = functionWordListsFactory();
// Import determineStem from "../morphology/determineStem";

import { get } from "lodash-es";
import { uniq } from "lodash-es";

/**
 * Returns only the relevant combinations from a list of word combinations. Assumes
 * occurrences have already been calculated.
 *
 * @param {WordCombination[]} wordCombinations A list of word combinations.
 *
 * @returns {WordCombination[]} Only relevant word combinations.
 */
function getRelevantCombinations( wordCombinations ) {
	wordCombinations = wordCombinations.filter( function( combination ) {
		return ( combination.getOccurrences() !== 1 && ! Number.isInteger( Number( combination.getWord() ) ) );
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
		const stemA = combinationA.getStem();
		const stemB = combinationB.getStem();

		if ( stemA < stemB ) {
			return -1;
		}

		if ( stemA > stemB ) {
			return 1;
		}

		return 0;
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
	// Sort the input array by stem
	wordCombinations.sort( function( wordA, wordB ) {
		return wordA.getStem() > wordB.getStem();
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
		Compare the stem of the current word in the loop with the previously available stem. If they equal, word combinations should be collapsed.
		When collapsing, the numbers of occurrences get summed.
		If the stem happens to equal the real word that occured in the text, we can be sure it's ok to display it to the customer.
		So, the stem reassigns the word.
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
	sortCombinations( collapsedRelevantWords );

	return collapsedRelevantWords;
}

/**
 * Returns the relevant words in a given text.
 *
 * @param {string} text The text to retrieve the relevant words of.
 * @param {string} language The paper's language.
 * @param {Object} morphologyData The morphologyData available for the language of the paper.
 *
 * @returns {WordCombination[]} All relevant words sorted and filtered for this text.
 */
function getRelevantWords( text, language ) {
	const functionWords = get( functionWordLists, language.concat( ".all" ), [] );

	const words = getWords( normalizeSingle( text ).toLocaleLowerCase() );

	if ( words.length === 0 ) {
		return [];
	}

	const uniqueContentWords = uniq( words.filter( word => ! functionWords.includes( word.trim() ) ) ).sort();

	const relevantWordsFromText = uniqueContentWords.map(
		word => new WordCombination(
			word,
			// As soon as the stemmer is merged, the next line should be changed to	determineStem( word, morphologyData ),
			word,
			words.filter( element => element === word ).length
		)
	);

	return collapseRelevantWordsOnStem( relevantWordsFromText );
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
function getRelevantWordsFromPaperAttributes( attributes, language ) {
	const { keyphrase, synonyms, metadescription, title, subheadings } = attributes;

	const functionWords = get( functionWordLists, language.concat( ".all" ), [] );

	const attributesJoined = normalizeSingle( keyphrase.concat( " ", synonyms, " ", metadescription, " ", title, " ", subheadings.join( " " ) ) );

	const wordsFromAttributes = getWords( attributesJoined.toLocaleLowerCase() );

	if ( wordsFromAttributes.length === 0 ) {
		return [];
	}

	// Also filter numbers!
	const uniqueContentWordsFromAttributes = uniq( wordsFromAttributes.filter( word => ! functionWords.includes( word.trim() ) ) );

	const relevantWordsFromAttributes = uniqueContentWordsFromAttributes.map(
		word => new WordCombination(
			word,
			// As soon as the stemmer is merged, the next line should be changed to	determineStem( word, morphologyData ),
			word,
			/* If a word is used in any of the attributes, its relevance is automatically high.
			To make sure the word survives relevance filters and gets saved in the database, make the number of occurrences times-3.*/
			wordsFromAttributes.filter( element => element === word ).length * 3
		)
	);

	return collapseRelevantWordsOnStem( relevantWordsFromAttributes );
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
