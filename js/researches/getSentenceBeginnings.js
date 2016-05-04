var getSentences = require( "../stringProcessing/getSentences.js" );
var getWords = require( "../stringProcessing/getWords.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var firstWordExceptions = require ( "../config/firstWordExceptions.js" )();
var find = require ( "lodash/find" );
var isUndefined = require ( "lodash/isUndefined" );

var getDuplicates = function ( sentenceBeginnings ) {
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
 * Gets the first word of each sentence from the text and returns those in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the first word of each sentence.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var sentenceBeginnings = sentences.map( function( sentence ) {
		sentence = stripSpaces( sentence );
		var words = getWords( sentence );
		var firstWord = words[ 0 ];
		if ( ! isUndefined( find( firstWordExceptions, firstWord ) ) ) {
			firstWord += " " + words[ 1 ];
		}

	} );
	var duplicates = getDuplicates( sentenceBeginnings );
};

