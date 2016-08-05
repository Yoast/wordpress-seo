var exclusions = require( "../researches/english/functionWords.js" )();
var getWords = require( "../stringProcessing/getWords.js" );
var normalizeSingleQuotes = require( "../stringProcessing/quotes.js" ).normalizeSingle;
var stripNumbers = require( "../stringProcessing/stripNumbers.js" );

var includes = require( "lodash/includes" );
var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );
var orderBy = require( "lodash/orderBy" );

/**
 * Removes all function words from a text.
 *
 * @param {string} text The text to remove all function words from
 * @returns {Array} The array containing all remaining words from the text.
 */
var removeFunctionWords = function ( text ) {
	var words = getWords( text );
	words.sort();
	var sortedWords = [];
	var occurrence = 1;
	forEach( words, function ( word, index ) {
		if ( word === words[ index + 1 ] ) {
			occurrence++;
		} else {
			sortedWords.push( { word: word, occurrence: occurrence } );
			occurrence = 1;
		}
	} );
	/*
	return filter( words, function ( word ) {
		return !includes( exclusions, word );
	} );
	*/

	var filteredWords = filter( sortedWords, function ( word ) {
		return !includes( exclusions, word.word );
	} );
	filteredWords = orderBy( filteredWords, [ "occurrence" ], [ "desc" ] );
	filteredWords = JSON.stringify( filteredWords );
	return filteredWords;

};

module.exports = function( paper ) {
	var text = paper.getText();
	text = text.toLocaleLowerCase();
	text = normalizeSingleQuotes( text );
	text = stripNumbers( text );
	return removeFunctionWords( text );
};
