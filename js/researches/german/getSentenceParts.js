var stopwords = require( "./passivevoice-german/stopwords.js" )();
var arrayToRegex = require( "../../stringProcessing/createRegexFromArray.js" );
var stripSpaces = require( "../../stringProcessing/stripSpaces.js" );
var SentencePart = require( "./GermanSentencePart.js" );
var auxiliaries = require( "./passivevoice-german/auxiliaries.js" )();

var forEach = require( "lodash/forEach" );
var isEmpty = require( "lodash/isEmpty" );

var stopwordRegex = arrayToRegex( stopwords );
var auxiliaryRegex = arrayToRegex( auxiliaries );

/**
 * Splits sentences into sentence parts based on stopwords.
 *
 * @param {string} sentence The sentence to split.
 * @param {Array} stopwords The array with matched stopwords.
 * @returns {Array} The array with sentence parts.
 */
function splitOnWord( sentence, stopwords ) {
	var currentSentence = sentence;
	var sentenceParts = [];
	forEach( stopwords, function( stopword ) {
		var splitSentence = currentSentence.split( stopword );
		if ( ! isEmpty( splitSentence[ 0 ] ) ) {
			sentenceParts.push( new SentencePart( splitSentence[ 0 ], splitSentence[ 0 ].match( auxiliaryRegex || [] ) ) );
		}
		var startIndex = currentSentence.indexOf( stopword );
		var endIndex = currentSentence.length;
		currentSentence = ( stripSpaces( currentSentence.substr( startIndex, endIndex ) ) );
	} );
	sentenceParts.push( new SentencePart( stripSpaces( currentSentence ), currentSentence.match( auxiliaryRegex || [] ) ) );
	return sentenceParts;
}

/**
 * Splits the sentence into sentence parts based on stopwords.
 *
 * @param {string} sentence The text to split into sentence parts.
 * @returns {Array} The array with sentence parts.
 */
function splitSentence( sentence ) {
	var matches = sentence.match( stopwordRegex ) || [];
	return splitOnWord( sentence, matches );
}

/**
 * Splits up the sentence in parts based on German stopwords.
 *
 * @param {string} sentence The sentence to split up in parts.
 * @returns {Array} The array with the sentence parts.
 */
module.exports = function( sentence ) {
	return splitSentence( sentence );
};

