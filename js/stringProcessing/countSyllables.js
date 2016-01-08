/** @module stringProcessing/countSyllables */

var cleanText = require( "stringProcessing/cleanText.js" );
var syllableArray = require( "config/syllables.js" );
var arrayToRegex = require( "stringProcessing/createRegexFromArray.js" );

/**
 * Checks the textstring for exclusion words. If they are found, returns the number of syllables these have, since
 * they are incorrectly detected with the syllablecounters based on regexes.
 *
 * @param {string} text The text to look for exclusionwords
 * @returns {number} The number of syllables found in the exclusionwords
 */
var countExclusionSyllables = function( text ) {
	var count = 0, wordArray, regex, matches;
	wordArray = syllableArray().exclusionWords;
	for ( var i = 0; i < wordArray.length; i++ ) {
		regex = new RegExp ( wordArray[i].word, "ig" );
		matches = text.match ( regex );
		if ( matches !== null ) {
			count += ( matches.length * wordArray[i].syllables );
		}
	}
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
	var exclusionWords = syllableArray().exclusionWords;
	var wordArray = [];
	for ( var i = 0; i < exclusionWords.length; i++ ) {
		wordArray.push( exclusionWords[i].word );
	}
	return text.replace( arrayToRegex( wordArray ), "" );
};

/**
 * Counts the syllables by splitting on consonants.
 *
 * @param {string} text A text with words to count syllables.
 * @returns {number} the syllable count
 */
var countBasicSyllables = function( text ) {
	var array = text.split( " " );
	var i, j, splitWord, count = 0;

	//split textstring to individual words
	for ( i = 0; i < array.length; i++ ) {

		//split on consonants
		splitWord = array[ i ].split( /[^aeiouy]/g );

		//if the string isn't empty, a consonant was found, up the counter
		for ( j = 0; j < splitWord.length; j++ ) {
			if ( splitWord[ j ] !== "" ) {
				count++;
			}
		}
	}

	return count;
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
			regex = arrayToRegex( syllableArray().addSyllables, true );
			break;
		case "subtract":
			regex = arrayToRegex( syllableArray().subtractSyllables, true );
			break;
		default:
			break;
	}
	for ( var i = 0; i < words.length; i++ ) {
		matches = words[i].match ( regex );
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

