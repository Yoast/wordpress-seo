var stopwords = require( "./passivevoice/stopwords.js" )();
var arrayToRegex = require( "../../stringProcessing/createRegexFromArray.js" );
var stripSpaces = require( "../../stringProcessing/stripSpaces.js" );
var SentencePart = require( "./SentencePart.js" );
var auxiliaries = require( "./passivevoice/auxiliaries.js" )();

var forEach = require( "lodash/forEach" );
var isEmpty = require( "lodash/isEmpty" );
var map = require( "lodash/map" );

var stopwordRegex = arrayToRegex( stopwords );
var auxiliaryRegex = arrayToRegex( auxiliaries );

/**
 * Strips spaces from the auxiliary matches.
 *
 * @param {Array} matches A list with matches of auxiliaries.
 * @returns {Array} A list with matches with spaces removed.
 */
function sanitizeMatches( matches ) {
	return map( matches, function( match ) {
		return stripSpaces( match );
	} );
}

/**
 * Splits sentences into sentence parts based on stopwords.
 *
 * @param {string} sentence The sentence to split.
 * @param {Array} stopwords The array with matched stopwords.
 * @returns {Array} The array with sentence parts.
 */
function splitOnWords( sentence, stopwords ) {
	var sentenceParts = [];
	forEach( stopwords, function( stopword ) {
		var splitSentence = sentence.split( stopword );
		if ( ! isEmpty( splitSentence[ 0 ] ) ) {
			var foundAuxiliaries = sanitizeMatches( splitSentence[ 0 ].match( auxiliaryRegex || [] ) );
			sentenceParts.push( new SentencePart( splitSentence[ 0 ], foundAuxiliaries,  "de_DE" ) );
		}
		var startIndex = sentence.indexOf( stopword );
		var endIndex = sentence.length;
		sentence = ( stripSpaces( sentence.substr( startIndex, endIndex ) ) );
	} );
	var foundAuxiliaries = sanitizeMatches( sentence.match( auxiliaryRegex || [] ) );
	sentenceParts.push( new SentencePart( stripSpaces( sentence ), foundAuxiliaries,  "de_DE" ) );
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
	return splitOnWords( sentence, matches );
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

