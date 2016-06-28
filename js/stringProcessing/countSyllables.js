/** @module stringProcessing/countSyllables */

var cleanText = require( "../stringProcessing/cleanText.js" );
var syllableMatchers = require( "../config/syllables.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

var getWords = require( "../stringProcessing/getWords.js" );

var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );

var exclusionWords = syllableMatchers().exclusionWords;
var exclusionWordsRegexes = map( exclusionWords, function( exclusionWord ) {
	return {
		regex: new RegExp( exclusionWord.word, "ig" ),
		syllables: exclusionWord.syllables
	};
} );
var addSyllablesRegex = arrayToRegex( syllableMatchers().addSyllables, true );
var subtractSyllablesRegex = arrayToRegex( syllableMatchers().subtractSyllables, true );
var vowelRegex = new RegExp( "[^" + syllableMatchers().vowels + "]", "ig" );

var LanguageSyllableRegexMaster = require( "../values/LanguageSyllableRegexMaster.js" );

var languageSyllableRegexMaster = new LanguageSyllableRegexMaster( syllableMatchers() );

/**
 * Counts the syllables by splitting on consonants.
 *
 * @param {string} text A text with words to count syllables.
 * @returns {number} the syllable count
 */
var countUsingVowels = function( text ) {
	var words = getWords( text );
	var numberOfSyllables = 0;

	forEach( words, function( word ) {
		var foundVowels = word.split( vowelRegex );
		var filteredWords = filter( foundVowels, function( vowel ){
			return vowel !== ""
		} );
		numberOfSyllables += filteredWords.length;
	} );

	return numberOfSyllables;
};


var countVowelExclusions = function( word ) {
	var syllableCount = 0;
	var array = languageSyllableRegexMaster.getAvailableLanguageSyllableRegexes();
	forEach( array, function( syllableMatcher ) {
		if( syllableMatcher.getRegex ) {
			syllableCount += syllableMatcher.countSyllables( word );
		}
	} );
	return syllableCount;
};

var countExclusions = function( word ) {
	var syllableCount = 0;
	forEach( exclusionWords, function( exclusionWordsObject ) {
		if( exclusionWordsObject.word === word ) {
			syllableCount = exclusionWordsObject.syllables;
			return;
		}
	} );
	return syllableCount;
};

var countSyllables = function( word ) {
	var count = 0;
	count += countUsingVowels( word );
	count += countVowelExclusions ( word );
	return count;
};

/**
 * Counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 *
 * @param {String} text The text to count the syllables from.
 * @returns {int} syllable count
 */
module.exports = function( text ) {
	var words = getWords( text );
	var count = 0;

	forEach( words, function( word ) {
		var exclusions = countExclusions( word );
		if ( exclusions !== 0 ) {
			count += exclusions;
			return;
		}
		count += countSyllables( word );
	} );

	return count;
};

