var getSentences = require( "../stringProcessing/getSentences.js" );
var getWords = require( "../stringProcessing/getWords.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var firstWordExceptions = require ( "../config/firstWordExceptions.js" )();

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @returns {array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function ( sentenceBeginnings ) {
	var counts = [];
	var count = 1;
	for ( var i = 0; i < sentenceBeginnings.length; i++ ) {
		if ( sentenceBeginnings[ i ] === sentenceBeginnings[ i + 1 ] ) {
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
	var text = paper.getText();
	var sentences = getSentences( text );
	var sentenceBeginnings = sentences.map( function( sentence ) {
		sentence = stripSpaces( sentence );
		var words = getWords( sentence );
		var firstWord = words[ 0 ];
		if ( firstWordExceptions.indexOf( firstWord ) > -1 ) {
			firstWord += " " + words[ 1 ];
		}
		return firstWord;
	} );
	return compareFirstWords( sentenceBeginnings );
};
