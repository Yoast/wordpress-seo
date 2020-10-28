/** @module stringProcessing/countSyllables */

import getWords from "../word/getWords.js";

import { forEach } from "lodash-es";
import { filter } from "lodash-es";
import { find } from "lodash-es";
import { isUndefined } from "lodash-es";
import { map } from "lodash-es";
import { sum } from "lodash-es";
import { memoize } from "lodash-es";
import { flatMap } from "lodash-es";

import SyllableCountIterator from "./syllableCountIterator.js";
import DeviationFragment from "./DeviationFragment";

/**
 * Counts vowel groups inside a word.
 *
 * @param {string} word         A text with words to count syllables.
 * @param {Object} syllables    The syllables data for the specific language.
 *
 * @returns {number} the syllable count.
 */
var countVowelGroups = function( word, syllables ) {
	var numberOfSyllables = 0;
	var vowelRegex = new RegExp( "[^" + syllables.vowels + "]", "ig" );
	var foundVowels = word.split( vowelRegex );
	var filteredWords = filter( foundVowels, function( vowel ) {
		return vowel !== "";
	} );
	numberOfSyllables += filteredWords.length;

	return numberOfSyllables;
};

/**
 * Counts the syllables using vowel exclusions. These are used for groups of vowels that are more or less
 * than 1 syllable.
 *
 * @param {String} word         The word to count syllables of.
 * @param {Object} syllables    The syllables data for the specific language.
 *
 * @returns {number} The number of syllables found in the given word.
 */
var countVowelDeviations = function( word, syllables ) {
	var syllableCountIterator = new SyllableCountIterator( syllables );
	return syllableCountIterator.countSyllables( word );
};

/**
 * Returns the number of syllables for the word if it is in the list of full word deviations.
 *
 * @param {String} word         The word to retrieve the syllables for.
 * @param {Object} syllables    The syllables data for the specific language.
 *
 * @returns {number} The number of syllables found.
 */
var countFullWordDeviations = function( word, syllables ) {
	var fullWordDeviations = syllables.deviations.words.full;

	var deviation = find( fullWordDeviations, function( fullWordDeviation ) {
		return fullWordDeviation.word === word;
	} );

	if ( ! isUndefined( deviation ) ) {
		return deviation.syllables;
	}

	return 0;
};

/**
 * Creates an array of deviation fragments for a certain locale.
 *
 * @param {Object} syllableConfig Syllable config for a certain locale.
 * @returns {DeviationFragment[]} A list of deviation fragments
 */
function createDeviationFragments( syllableConfig ) {
	var deviationFragments = [];

	var deviations = syllableConfig.deviations;

	if ( ! isUndefined( deviations.words ) && ! isUndefined( deviations.words.fragments ) ) {
		deviationFragments = flatMap( deviations.words.fragments, function( fragments, fragmentLocation ) {
			return map( fragments, function( fragment ) {
				fragment.location = fragmentLocation;

				return new DeviationFragment( fragment );
			} );
		} );
	}

	return deviationFragments;
}

var createDeviationFragmentsMemoized = memoize( createDeviationFragments );

/**
 * Counts syllables in partial exclusions. If these are found, returns the number of syllables  found, and the modified word.
 * The word is modified so the excluded part isn't counted by the normal syllable counter.
 *
 * @param {String} word The word to count syllables of.
 * @param {Object} syllables    The syllables data for the specific language.
 *
 * @returns {object} The number of syllables found and the modified word.
 */
var countPartialWordDeviations = function( word, syllables ) {
	var deviationFragments = createDeviationFragmentsMemoized( syllables );
	var remainingParts = word;
	var syllableCount = 0;

	forEach( deviationFragments, function( deviationFragment ) {
		if ( deviationFragment.occursIn( remainingParts ) ) {
			remainingParts = deviationFragment.removeFrom( remainingParts );
			syllableCount += deviationFragment.getSyllables();
		}
	} );

	return { word: remainingParts, syllableCount: syllableCount };
};

/**
 * Count the number of syllables in a word, using vowels and exceptions.
 *
 * @param {String} word         The word to count the number of syllables of.
 * @param {Object} syllables    The syllables data for the specific language.
 *
 * @returns {number} The number of syllables found in a word.
 */
var countUsingVowels = function( word, syllables ) {
	var syllableCount = 0;

	syllableCount += countVowelGroups( word, syllables );
	syllableCount += countVowelDeviations( word, syllables );

	return syllableCount;
};

/**
 * Counts the number of syllables in a word.
 *
 * @param {string} word         The word to count syllables of.
 * @param {Object} syllables    The syllables data for the specific language.
 *
 * @returns {number} The syllable count for the word.
 */
var countSyllablesInWord = function( word, syllables ) {
	var syllableCount = 0;

	var fullWordExclusion = countFullWordDeviations( word, syllables );
	if ( fullWordExclusion !== 0 ) {
		return fullWordExclusion;
	}

	var partialExclusions = countPartialWordDeviations( word, syllables );
	word = partialExclusions.word;
	syllableCount += partialExclusions.syllableCount;
	syllableCount += countUsingVowels( word, syllables );

	return syllableCount;
};

/**
 * Counts the number of syllables in a text per word based on vowels.
 * Uses exclusion words for words that cannot be matched with vowel matching.
 *
 * @param {String} text         The text to count the syllables of.
 * @param {Object} syllables    The syllables data for the specific language.
 *
 * @returns {int} The total number of syllables found in the text.
 */
var countSyllablesInText = function( text, syllables ) {
	text = text.toLocaleLowerCase();
	var words = getWords( text );

	var syllableCounts = map( words,  function( word ) {
		return countSyllablesInWord( word, syllables );
	} );

	return sum( syllableCounts );
};

export default countSyllablesInText;
