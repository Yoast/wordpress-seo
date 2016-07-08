/** @module stringProcessing/countSyllables */

var syllableMatchers = require( "../config/syllables.js" );

var getWords = require( "../stringProcessing/getWords.js" );

var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );

var exclusionWords = syllableMatchers().exclusionWords;

var vowelRegex = new RegExp( "[^" + syllableMatchers().vowels + "]", "ig" );

var SyllableCountIterator = require( "../values/syllableCountIterator.js" );

var syllableCountIterator = new SyllableCountIterator( syllableMatchers() );

/**
 * Counts the syllables by splitting on consonants, leaving groups of vowels.
 *
 * @param {string} word A text with words to count syllables.
 * @returns {number} the syllable count.
 */
var countUsingVowels = function( word ) {
	var numberOfSyllables = 0;
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
 * @returns {number} The number of syllables found in the given word.
 */
var countVowelExclusions = function( word ) {
	return syllableCountIterator.countSyllables( word );
};

/**
 * Checks if the word is an exclusion word.
 *
 * @param {String} word The word to check against exclusion words.
 * @returns {number} The number of syllables found.
 */
var countSyllablesInExclusions = function( word ) {
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
 * Count the number of syllables in a word, using vowels and exceptions.
 *
 * @param {String} word The word to count the number of syllables.
 * @returns {number} The number of syllables found in a word.
 */
var countSyllables = function( word ) {
	var syllableCount = 0;
	syllableCount += countUsingVowels( word );
	syllableCount += countVowelExclusions ( word );
	return syllableCount;
};

/**
 * Counts the number of syllables in a textstring per word based on vowels.
 * Uses exclusion words for words that cannot be matched with vowel matching.
 *
 * @param {String} text The text to count the syllables in.
 * @returns {int} The total number of syllables found in the text.
 */
module.exports = function( text ) {
	var words = getWords( text );

	var syllableCount = 0;

	forEach( words, function( word ) {
		var exclusions = countSyllablesInExclusions( word );
		if ( exclusions !== 0 ) {
			syllableCount += exclusions;
			return;
		}
		syllableCount += countSyllables( word );
	} );
	return syllableCount;
};

