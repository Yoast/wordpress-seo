/** @module stringProcessing/countSyllables */

var cleanText = require( "../stringProcessing/cleanText.js" );
var syllableArray = require( "../config/syllables.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

var getWords = require( "../stringProcessing/getWords.js" );

var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );

var exclusionWords = syllableArray().exclusionWords;
var exclusionWordsRegexes = map( exclusionWords, function( exclusionWord ) {
	return {
		regex: new RegExp( exclusionWord.word, "ig" ),
		syllables: exclusionWord.syllables
	};
} );
var addSyllablesRegex = arrayToRegex( syllableArray().addSyllables, true );
var subtractSyllablesRegex = arrayToRegex( syllableArray().subtractSyllables, true );
var vowelRegex = new RegExp( "[^" + syllableArray().vowels + "]", "ig" );

/**
 * Checks the textstring for exclusion words. If they are found, returns the number of syllables these have, since
 * they are incorrectly detected with the syllablecounters based on regexes.
 *
 * @param {string} text The text to look for exclusionwords
 * @returns {number} The number of syllables found in the exclusionwords
 */
var countExclusionSyllables = function( text ) {
	var count = 0, matches;

	forEach( exclusionWordsRegexes, function( exclusionWordRegex ) {
		matches = text.match( exclusionWordRegex.regex );

		if ( matches !== null ) {
			count += ( matches.length * exclusionWordRegex.syllables );
		}
	} );

	return count;
};

/**
 * Removes words from the text that are in the exclusion array. These words are counted
 * incorrectly in the syllable counters, so they are removed and checked sperately.
 *
 * @param {string} text The text to remove words from
 * @returns {string} The text with the exclusionwords removed
 */
var removeExclusionWords = function( text ) {
	forEach( exclusionWordsRegexes, function( exclusionWordRegex ) {
		text = text.replace( exclusionWordRegex.regex, "" );
	} );

	return text;
};

/**
 * Counts the syllables by splitting on consonants.
 *
 * @param {string} text A text with words to count syllables.
 * @returns {number} the syllable count
 */
var countBasicSyllables = function( text ) {

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

/**
 * Advanced syllable counter to match texstring with regexes.
 *
 * @param {String} text The text to count the syllables.
 * @param {String} operator The operator to determine which regex to use.
 * @returns {number} the amount of syllables found in string.
 */
var countAdvancedSyllables = function( text, operator ) {
	var matches, count = 0, words = text.split( " " );
	var regex = "";
	switch ( operator ) {
		case "add":
			regex = addSyllablesRegex;
			break;
		case "subtract":
			regex = subtractSyllablesRegex;
			break;
		default:
			break;
	}
	for ( var i = 0; i < words.length; i++ ) {
		matches = words[ i ].match( regex );
		if ( matches !== null ) {
			count += matches.length;
		}
	}
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
	var count = 0;
	count += countExclusionSyllables( text );

	text = removeExclusionWords( text );
	text = cleanText( text );
	text.replace( /[.]/g, " " );

	count += countBasicSyllables( text );
	count += countAdvancedSyllables( text, "add" );
	count -= countAdvancedSyllables( text, "subtract" );

	return count;
};

