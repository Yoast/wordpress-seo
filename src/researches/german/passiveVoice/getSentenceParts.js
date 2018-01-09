var stopwords = require( "./stopwords.js" )();
var arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );
var stripSpaces = require( "../../../stringProcessing/stripSpaces.js" );
var SentencePart = require( "./SentencePart.js" );
var auxiliaries = require( "./auxiliaries.js" )().allAuxiliaries;

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
	var splitSentences = [];

	// Split the sentence on each found stopword and push this part in an array.
	forEach( stopwords, function( stopword ) {
		var splitSentence = sentence.split( stopword );
		if ( ! isEmpty( splitSentence[ 0 ] ) ) {
			splitSentences.push( splitSentence[ 0 ] );
		}
		var startIndex = sentence.indexOf( stopword );
		var endIndex = sentence.length;
		sentence = stripSpaces( sentence.substr( startIndex, endIndex ) );
	} );

	// Push the remainder of the sentence in the sentence parts array.
	splitSentences.push( sentence );
	return splitSentences;
}

/**
 * Creates sentence parts based on split sentences.
 *
 * @param {Array} sentences The array with split sentences.
 * @returns {Array} The array with sentence parts.
 */
function createSentenceParts( sentences ) {
	var sentenceParts = [];
	forEach( sentences, function( part ) {
		var foundAuxiliaries = sanitizeMatches( part.match( auxiliaryRegex || [] ) );
		sentenceParts.push( new SentencePart( part, foundAuxiliaries,  "de_DE" ) );
	} );
	return sentenceParts;
}

/**
 * Splits the sentence into sentence parts based on stopwords.
 *
 * @param {string} sentence The text to split into sentence parts.
 * @returns {Array} The array with sentence parts.
 */
function splitSentence( sentence ) {
	var stopwords = sentence.match( stopwordRegex ) || [];
	var splitSentences = splitOnWords( sentence, stopwords );
	return createSentenceParts( splitSentences );
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

