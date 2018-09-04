import getWords from "../stringProcessing/getWords.js";
import getSentences from "../stringProcessing/getSentences.js";
import WordCombination from "../values/WordCombination.js";
import { normalize as normalizeQuotes } from "../stringProcessing/quotes.js";
import functionWordListsFactory from "../helpers/getFunctionWords.js";
const functionWordLists = functionWordListsFactory();
import getLanguage from "../helpers/getLanguage.js";

import { filter } from "lodash-es";
import { map } from "lodash-es";
import { forEach } from "lodash-es";
import { has } from "lodash-es";
import { flatMap } from "lodash-es";
import { values } from "lodash-es";
import { take } from "lodash-es";
import { includes } from "lodash-es";
import { intersection } from "lodash-es";
import { isEmpty } from "lodash-es";

let densityLowerLimit = 0;
let densityUpperLimit = 0.03;
let relevantWordLimit = 100;
let wordCountLowerLimit = 200;

// First four characters: en dash, em dash, hyphen-minus, and copyright sign.
let specialCharacters = [ "–", "—", "-", "\u00a9", "#", "%", "/", "\\", "$", "€", "£", "*", "•", "|", "→", "←", "}", "{", "//", "||", "\u200b" ];

/**
 * Returns the word combinations for the given text based on the combination size.
 *
 * @param {string} text The text to retrieve combinations for.
 * @param {number} combinationSize The size of the combinations to retrieve.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {WordCombination[]} All word combinations for the given text.
 */
function getWordCombinations( text, combinationSize, functionWords ) {
	let sentences = getSentences( text );

	let words, combination;

	return flatMap( sentences, function( sentence ) {
		sentence = sentence.toLocaleLowerCase();
		sentence = normalizeQuotes( sentence );
		words = getWords( sentence );

		return filter( map( words, function( word, i ) {
			// If there are still enough words in the sentence to slice of.
			if ( i + combinationSize - 1 < words.length ) {
				combination = words.slice( i, i + combinationSize );
				return new WordCombination( combination, 0, functionWords );
			}

			return false;
		} ) );
	} );
}

/**
 * Calculates occurrences for a list of word combinations.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to calculate occurrences for.
 * @returns {WordCombination[]} Word combinations with their respective occurrences.
 */
function calculateOccurrences( wordCombinations ) {
	let occurrences = {};

	forEach( wordCombinations, function( wordCombination ) {
		let combination = wordCombination.getCombination();

		if ( ! has( occurrences, combination ) ) {
			occurrences[ combination ] = wordCombination;
		}

		occurrences[ combination ].incrementOccurrences();
	} );

	return values( occurrences );
}

/**
 * Returns only the relevant combinations from a list of word combinations. Assumes
 * occurrences have already been calculated.
 *
 * @param {WordCombination[]} wordCombinations A list of word combinations.
 * @returns {WordCombination[]} Only relevant word combinations.
 */
function getRelevantCombinations( wordCombinations ) {
	wordCombinations = wordCombinations.filter( function( combination ) {
		return combination.getOccurrences() !== 1 &&
			combination.getRelevance() !== 0;
	} );
	return wordCombinations;
}

/**
 * Sorts combinations based on their relevance and length.
 *
 * @param {WordCombination[]} wordCombinations The combinations to sort.
 * @returns {void}
 */
function sortCombinations( wordCombinations ) {
	wordCombinations.sort( function( combinationA, combinationB ) {
		let difference = combinationB.getRelevance() - combinationA.getRelevance();
		// The combination with the highest relevance comes first.
		if ( difference !== 0 ) {
			return difference;
		}
		// In case of a tie on relevance, the longest combination comes first.
		return combinationB.getLength() - combinationA.getLength();
	} );
}

/**
 * Filters word combinations that consist of a single one-character word.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOneCharacterWordCombinations( wordCombinations ) {
	return wordCombinations.filter( function( combination ) {
		return ! ( combination.getLength() === 1 && combination.getWords()[ 0 ].length <= 1 );
	} );
}

/**
 * Filters word combinations containing certain function words at any position.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAnywhere( wordCombinations, functionWords ) {
	return wordCombinations.filter( function( combination ) {
		return isEmpty(
			intersection( functionWords, combination.getWords() )
		);
	} );
}

/**
 * Filters word combinations beginning with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtBeginning( wordCombinations, functionWords ) {
	return wordCombinations.filter( function( combination ) {
		return ! includes( functionWords, combination.getWords()[ 0 ] );
	} );
}

/**
 * Filters word combinations ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtEnding( wordCombinations, functionWords ) {
	return wordCombinations.filter( function( combination ) {
		let words = combination.getWords();
		let lastWordIndex = words.length - 1;
		return ! includes( functionWords, words[ lastWordIndex ] );
	} );
}

/**
 * Filters word combinations beginning and ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {Array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtBeginningAndEnding( wordCombinations, functionWords ) {
	wordCombinations = filterFunctionWordsAtBeginning( wordCombinations, functionWords );
	wordCombinations = filterFunctionWordsAtEnding( wordCombinations, functionWords );
	return wordCombinations;
}

/**
 * Filters word combinations based on keyword density if the word count is 200 or over.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {number} wordCount The number of words in the total text.
 * @param {number} densityLowerLimit The lower limit of keyword density.
 * @param {number} densityUpperLimit The upper limit of keyword density.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOnDensity( wordCombinations, wordCount, densityLowerLimit, densityUpperLimit ) {
	return wordCombinations.filter( function( combination ) {
		return ( combination.getDensity( wordCount ) >= densityLowerLimit && combination.getDensity( wordCount ) < densityUpperLimit
		);
	} );
}

/**
 * Filters combinations based on whether they end with a specified string or not.
 *
 * @param {WordCombination[]} wordCombinations The array of WordCombinations to filter.
 * @param {string} str The string the WordCombinations that need to be filtered out end with.
 * @param {string[]} exceptions The array of strings containing exceptions to not filter.
 * @returns {WordCombination[]} The filtered array of WordCombinations.
 */
function filterEndingWith( wordCombinations, str, exceptions ) {
	wordCombinations = wordCombinations.filter( function( combination ) {
		let combinationstr = combination.getCombination();
		for ( let i = 0; i < exceptions.length; i++ ) {
			if ( combinationstr.endsWith( exceptions[ i ] ) ) {
				return true;
			}
		}
		return ! combinationstr.endsWith( str );
	} );
	return wordCombinations;
}

/**
 * Filters the list of word combination objects based on the language-specific function word filters.
 * Word combinations with specific parts of speech are removed.
 *
 * @param {Array} combinations The list of word combination objects.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {Array} The filtered list of word combination objects.
 */
function filterFunctionWords( combinations, functionWords ) {
	combinations = filterFunctionWordsAnywhere( combinations, functionWords.filteredAnywhere );
	combinations = filterFunctionWordsAtBeginningAndEnding( combinations, functionWords.filteredAtBeginningAndEnding );
	combinations = filterFunctionWordsAtEnding( combinations, functionWords.filteredAtEnding );
	combinations = filterFunctionWordsAtBeginning( combinations, functionWords.filteredAtBeginning );
	return combinations;
}

/**
 * Filters the list of word combination objects based on function word filters, a special character filter and
 * a one-character filter.
 *
 * @param {Array} combinations The list of word combination objects.
 * @param {Function} functionWords The function containing the lists of function words.
 * @param {string} language The language for which specific filters should be applied.
 * @returns {Array} The filtered list of word combination objects.
 */
function filterCombinations( combinations, functionWords, language ) {
	combinations = filterFunctionWordsAnywhere( combinations, specialCharacters );
	combinations = filterOneCharacterWordCombinations( combinations );
	combinations = filterFunctionWords( combinations, functionWords );
	if( language === "en" ) {
		combinations = filterEndingWith( combinations, "'s", [] );
	}
	return combinations;
}
/**
 * Returns the relevant words in a given text.
 *
 * @param {string} text The text to retrieve the relevant words of.
 * @param {string} locale The paper's locale.
 * @returns {WordCombination[]} All relevant words sorted and filtered for this text.
 */
function getRelevantWords( text, locale ) {
	let language = getLanguage( locale );
	if ( ! functionWordLists.hasOwnProperty( language ) ) {
		language = "en";
	}

	let functionWords = functionWordLists[ language ];

	let words = getWordCombinations( text, 1, functionWords.all );
	let wordCount = words.length;

	let oneWordCombinations = getRelevantCombinations(
		calculateOccurrences( words )
	);

	sortCombinations( oneWordCombinations );
	oneWordCombinations = take( oneWordCombinations, 100 );

	let oneWordRelevanceMap = {};

	forEach( oneWordCombinations, function( combination ) {
		oneWordRelevanceMap[ combination.getCombination() ] = combination.getRelevance( functionWords );
	} );

	let twoWordCombinations = calculateOccurrences( getWordCombinations( text, 2, functionWords.all ) );
	let threeWordCombinations = calculateOccurrences( getWordCombinations( text, 3, functionWords.all ) );
	let fourWordCombinations = calculateOccurrences( getWordCombinations( text, 4, functionWords.all ) );
	let fiveWordCombinations = calculateOccurrences( getWordCombinations( text, 5, functionWords.all ) );

	let combinations = oneWordCombinations.concat(
		twoWordCombinations,
		threeWordCombinations,
		fourWordCombinations,
		fiveWordCombinations
	);

	combinations = filterCombinations( combinations, functionWords, language );

	forEach( combinations, function( combination ) {
		combination.setRelevantWords( oneWordRelevanceMap );
	} );

	combinations = getRelevantCombinations( combinations );
	sortCombinations( combinations );

	if ( wordCount >= wordCountLowerLimit ) {
		combinations = filterOnDensity( combinations, wordCount, densityLowerLimit, densityUpperLimit );
	}

	return take( combinations, relevantWordLimit );
}

export {
	getWordCombinations,
	getRelevantWords,
	calculateOccurrences,
	getRelevantCombinations,
	sortCombinations,
	filterFunctionWordsAtEnding,
	filterFunctionWordsAtBeginning,
	filterFunctionWords,
	filterFunctionWordsAnywhere,
	filterOnDensity,
	filterOneCharacterWordCombinations,
	filterEndingWith,
};

export default {
	getWordCombinations: getWordCombinations,
	getRelevantWords: getRelevantWords,
	calculateOccurrences: calculateOccurrences,
	getRelevantCombinations: getRelevantCombinations,
	sortCombinations: sortCombinations,
	filterFunctionWordsAtEnding: filterFunctionWordsAtEnding,
	filterFunctionWordsAtBeginning: filterFunctionWordsAtBeginning,
	filterFunctionWords: filterFunctionWordsAtBeginningAndEnding,
	filterFunctionWordsAnywhere: filterFunctionWordsAnywhere,
	filterOnDensity: filterOnDensity,
	filterOneCharacterWordCombinations: filterOneCharacterWordCombinations,
	filterEndingWith: filterEndingWith,
};
