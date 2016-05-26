var getSentences = require( "../stringProcessing/getSentences.js" );
var getWords = require( "../stringProcessing/getWords.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var removeNonWordCharacters = require( "../stringProcessing/removeNonWordCharacters.js" );
var firstWordExceptions = require ( "../language/en/firstWordExceptions.js" )();

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {number} i The iterator for the sentenceBeginning array.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
var matchSentenceBeginnings = function( sentenceBeginnings, i ) {
	if ( sentenceBeginnings[ i ] === sentenceBeginnings[ i + 1 ] ) {
		return true;
	}
	return false;
};

/**
 * Counts the number of similar sentence beginnings.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @returns {array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function ( sentenceBeginnings ) {
	var counts = [];
	var count = 1;
	for ( var i = 0; i < sentenceBeginnings.length; i++ ) {
		if ( matchSentenceBeginnings( sentenceBeginnings, i ) ) {
			count++;
		} else {
			counts.push( { word: sentenceBeginnings[ i ], count: count } );
			count = 1;
		}
	}
	return counts;
};

/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	var sentenceBeginnings = sentences.map( function( sentence ) {
		var words = getWords( stripSpaces( sentence ) );
		if( words.length === 0 ) {
			return "";
		}
		var firstWord = removeNonWordCharacters( words[ 0 ] );
		if ( firstWordExceptions.indexOf( firstWord ) > -1 ) {
			firstWord += " " + removeNonWordCharacters( words[ 1 ] );
		}
		return firstWord;
	} );
	return compareFirstWords( sentenceBeginnings );
};
