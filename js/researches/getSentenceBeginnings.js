var getSentences = require( "../stringProcessing/getSentences.js" );
var getWords = require( "../stringProcessing/getWords.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var removeNonWordCharacters = require( "../stringProcessing/removeNonWordCharacters.js" );
var getFirstWordExceptions = require( "../helpers/getFirstWordExceptions.js" );

var isEmpty = require( "lodash/isEmpty" );
var forEach = require( "lodash/forEach" );

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 *
 * @param {string} currentSentenceBeginning The first word of the current sentence.
 * @param {string} nextSentenceBeginning The first word of the next sentence.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
var startsWithSameWord = function( currentSentenceBeginning, nextSentenceBeginning ) {
	if ( !isEmpty( currentSentenceBeginning ) && currentSentenceBeginning === nextSentenceBeginning ) {
		return true;
	}
	return false;
};

/**
 * Counts the number of similar sentence beginnings.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {array} sentences The array containing all sentences.
 * @returns {array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function ( sentenceBeginnings, sentences ) {
	var consecutiveFirstWords = [];
	var foundSentences = [];
	var sameBeginnings = 1;

	forEach( sentenceBeginnings, function( beginning, i ) {
		var currentSentenceBeginning = beginning;
		var nextSentenceBeginning = sentenceBeginnings[ i + 1 ];
		foundSentences.push( sentences[ i ] );

		if ( startsWithSameWord( currentSentenceBeginning, nextSentenceBeginning ) ) {
			sameBeginnings++;
		} else {
			consecutiveFirstWords.push( { word: currentSentenceBeginning, count: sameBeginnings, sentences: foundSentences } );
			sameBeginnings = 1;
			foundSentences = [];
		}
	} );

	return consecutiveFirstWords;
};

/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	var firstWordExceptions = getFirstWordExceptions( paper.getLocale() )();
	var sentenceBeginnings = sentences.map( function( sentence ) {
		var words = getWords( stripSpaces( sentence ) );
		if( words.length === 0 ) {
			return "";
		}
		var firstWord = removeNonWordCharacters( words[ 0 ] ).toLocaleLowerCase();
		if ( firstWordExceptions.indexOf( firstWord ) > -1 ) {
			firstWord += " " + removeNonWordCharacters( words[ 1 ] );
		}
		return firstWord;
	} );
	return compareFirstWords( sentenceBeginnings, sentences );
};


