/** @module stringProcessing/countSyllables */

var syllableMatchers = require( "../config/syllables.js" );

var getWords = require( "../stringProcessing/getWords.js" );

var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );

var SyllableCountIterator = require( "../helpers/syllableCountIterator.js" );
var ExclusionCountIterator = require( "../helpers/exclusionCountIterator.js" );


/**
 * Counts the syllables by splitting on consonants, leaving groups of vowels.
 *
 * @param {string} word A text with words to count syllables.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} the syllable count.
 */
var countUsingVowels = function( word, locale ) {
	var numberOfSyllables = 0;
	var vowelRegex = new RegExp( "[^" + syllableMatchers( locale ).vowels + "]", "ig" );
	var foundVowels = word.split( vowelRegex );
	var filteredWords = filter( foundVowels, function( vowel ) {
		return vowel !== "";
	} );
	numberOfSyllables += filteredWords.length;

	return numberOfSyllables;
};

/**
 * Counts the syllables using vowel exclusions. These are used for groups of vowels that are more or less
 * then 1 syllable.
 *
 * @param {String} word The word to count syllables in.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in the given word.
 */
var countVowelExclusions = function( word, locale ) {
	var syllableCountIterator = new SyllableCountIterator( syllableMatchers( locale ) );
	return syllableCountIterator.countSyllables( word );
};

/**
 * Checks if the word is an exclusion word.
 *
 * @param {String} word The word to check against exclusion words.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found.
 */
var countSyllablesInExclusions = function( word, locale ) {
	var exclusionWords = syllableMatchers( locale ).exclusionWords;
	var syllableCount = 0;
	forEach( exclusionWords, function( exclusionWordsObject ) {
		if( exclusionWordsObject.word === word ) {
			syllableCount = exclusionWordsObject.syllables;

			// If we find an exclusion, we can break out of this forEach.
			return false;
		}
	} );
	return syllableCount;
};

/**
 * Counts syllables in partial exclusions. If these are found, the number of syllables are found, and the modified word, as to not do
 * multiple checks on the same word.
 *
 * @param {String} word The word to count syllables in.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {object} The number of syllables found and the modified word.
 */
var countSyllablesInPartialExclusions = function( word, locale ) {
	var exclusionCountIterator = new ExclusionCountIterator( syllableMatchers( locale ) );
	return exclusionCountIterator.countSyllables( word );
};

/**
 * Count the number of syllables in a word, using vowels and exceptions.
 *
 * @param {String} word The word to count the number of syllables.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in a word.
 */
var countSyllables = function( word, locale ) {
	var syllableCount = 0;
	syllableCount += countUsingVowels( word, locale );
	syllableCount += countVowelExclusions( word, locale );
	return syllableCount;
};

/**
 * Counts the number of syllables in a textstring per word based on vowels.
 * Uses exclusion words for words that cannot be matched with vowel matching.
 *
 * @param {String} text The text to count the syllables in.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {int} The total number of syllables found in the text.
 */
module.exports = function( text, locale ) {
	text = text.toLocaleLowerCase();
	var words = getWords( text );
	var syllableCount = 0;

	forEach( words, function( word ) {
		var exclusions = countSyllablesInExclusions( word, locale );
		if ( exclusions !== 0 ) {
			syllableCount += exclusions;
			return;
		}
		var partlyExclusions = countSyllablesInPartialExclusions( word, locale );
		word = partlyExclusions.word;
		syllableCount += partlyExclusions.syllableCount;
		syllableCount += countSyllables( word, locale );
	} );
	return syllableCount;
};

