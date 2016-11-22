var getSentences = require( "../../../stringProcessing/getSentences.js" );
var stopwords = require( "/stopwords.js" )();
var arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );
var stripSpaces = require( "../../../stringProcessing/stripSpaces.js" );

var forEach = require( "lodash/forEach" );
var isEmpty = require( "lodash/isEmpty" );

var stopwordRegex = arrayToRegex( stopwords );

/**
 * Splits sentences into sentence parts based on stopwords.
 *
 * @param {string} sentence The sentence to split.
 * @param {Array} stopwords The array with matched stopwords.
 * @returns {Array} The array with sentence parts.
 */
function splitOnWords( sentence, stopwords ) {
	var sentenceParts = [];
	forEach( stopwords, function( word ) {
		var splitSentence = sentence.split( word );
		if ( ! isEmpty( splitSentence[ 0 ] ) ) {
			sentenceParts = sentenceParts.concat( splitSentence[ 0 ] );
		}
		var startIndex = sentence.indexOf( word );
		var endIndex = sentence.length;
		sentence = ( stripSpaces( sentence.substr( startIndex, endIndex ) ) );
	} );
	sentenceParts = sentenceParts.concat( stripSpaces( sentence ) );
	return sentenceParts;
}

/**
 * Splits the sentences from a text into sentence parts based on stopwords.
 *
 * @param {string} text The text to split into sentence parts.
 * @returns {Array} The array with sentence parts.
 */
function splitSentences( text ) {
	var sentences = getSentences( text );
	var splitSentences = [];
	forEach( sentences, function( sentence ) {
		var matches = sentence.match( stopwordRegex ) || [];
		splitSentences = splitSentences.concat( splitOnWords( sentence, matches ) );
	} );
	return splitSentences;
}

module.exports = function( text ) {
	return splitSentences( text );
};
