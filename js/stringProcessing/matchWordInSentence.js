var wordBoundaries = require( "../config/wordBoundaries.js" )();
var includes = require( "lodash/includes" );

/**
 * Checks whether a character is present in the list of word boundaries.
 *
 * @param {string} character The character to look for.
 * @returns {boolean} Whether or not the character is present in the list of word boundaries.
 */
var characterInBoundary = function( character ) {
	return includes( wordBoundaries, character );
};

/**
 * Checks whether a word is present in a sentence.
 *
 * @param {string} word The word to search for in the sentence.
 * @param {string} sentence The sentence to look through.
 * @returns {boolean} Whether or not the word is present in the sentence.
 */
module.exports = function( word, sentence ) {
	// To ensure proper matching, make everything lowercase.
	word = word.toLocaleLowerCase();
	sentence = sentence.toLocaleLowerCase();

	var occurrenceStart = sentence.indexOf( word );
	var occurrenceEnd = occurrenceStart + word.length;

	// Return false if no match has been found.
	if ( occurrenceStart === -1 ) {
		return false;
	}

	// Check if the previous and next character are word boundaries to determine if a complete word was detected
	var previousCharacter = characterInBoundary( sentence[occurrenceStart - 1 ] ) || occurrenceStart === 0;
	var nextCharacter = characterInBoundary( sentence[ occurrenceEnd ] ) || occurrenceEnd === sentence.length;

	return ( ( previousCharacter ) && ( nextCharacter ) );
};
