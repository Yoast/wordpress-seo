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
 * @param {Array} matches The array with matched stopwords.
 * @returns {Array} The array with sentence parts.
 */
function splitOnWord( sentence, matches ) {
	var currentSentence = sentence;
	var sentenceParts = [];
	forEach( matches, function( match ) {
		var splitSentence = currentSentence.split( match );
		if ( ! isEmpty( splitSentence[ 0 ] ) ) {
			sentenceParts.push( new SentencePart( splitSentence[ 0 ], splitSentence[ 0 ].match( auxiliaryRegex || [] ) ) );
		}
		var startIndex = currentSentence.indexOf( match );
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
function splitSentences( sentence ) {
	var matches = sentence.match( stopwordRegex ) || [];
	return splitOnWord( sentence, matches );
}

module.exports = function( sentence ) {
	return splitSentences( sentence );
};

