var indices = require( "../../stringProcessing/indices" );
var getIndicesOfList = indices.getIndicesByWordList;
var filterIndices = indices.filterIndices;
var sortIndices = indices.sortIndices;
var stripSpaces = require( "../../stringProcessing/stripSpaces.js" );
var normalizeSingleQuotes = require( "../../stringProcessing/quotes.js" ).normalizeSingle;
var arrayToRegex = require( "../../stringProcessing/createRegexFromArray.js" );

var auxiliaries = require( "./passivevoice/auxiliaries.js" )().auxiliaries;
var SentencePart = require( "./SentencePart.js" );
var auxiliaryRegex = arrayToRegex( auxiliaries );
var stopwords = require( "./passivevoice/stopwords.js" )();

var isUndefined = require( "lodash/isUndefined" );
var map = require( "lodash/map" );

/**
 * Gets the indexes of sentence breakers (auxiliaries and stopwords) to determine sentence parts.
 * Indices are filtered because there could be duplicate matches, like "even though" and "though".
 * In addition, 'having' will be matched both as a -ing verb as well as an auxiliary.
 *
 * @param {string} sentence The sentence to check for indices of auxiliaries, stopwords and active verbs.
 * @returns {Array} The array with valid indices to use for determining sentence parts.
 */
var getSentenceBreakers = function( sentence ) {
	sentence = sentence.toLocaleLowerCase();
	var auxiliaryIndices = getIndicesOfList( auxiliaries, sentence );
	var stopwordIndices = getIndicesOfList( stopwords, sentence );

	// Concat all indices arrays, filter them and sort them.
	var indices = [].concat( auxiliaryIndices, stopwordIndices );
	indices = filterIndices( indices );
	return sortIndices( indices );
};

/**
 * Gets the matches with the auxiliaries in the sentence.
 *
 * @param {string} sentencePart The part of the sentence to match for auxiliaries.
 * @returns {Array} All formatted matches from the sentence part.
 */
var getAuxiliaryMatches = function( sentencePart ) {
	var auxiliaryMatches = sentencePart.match( auxiliaryRegex ) || [];

	return map( auxiliaryMatches, function( auxiliaryMatch ) {
		return stripSpaces( auxiliaryMatch );
	} );
};

/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
var getSentenceParts = function( sentence ) {
	var sentenceParts = [];
	sentence = normalizeSingleQuotes( sentence );

	// First check if there is an auxiliary in the sentence.
	if ( sentence.match( auxiliaryRegex ) === null ) {
		return sentenceParts;
	}

	var indices = getSentenceBreakers( sentence );
	// Get the words after the found auxiliary.
	for ( var i = 0; i < indices.length; i++ ) {
		var endIndex = sentence.length;
		if ( ! isUndefined( indices[ i + 1 ] ) ) {
			endIndex = indices[ i + 1 ].index;
		}

		// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
		var sentencePart = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );

		var auxiliaryMatches = getAuxiliaryMatches(  sentencePart );
		// If a sentence part doesn't have an auxiliary, we don't need it, so it can be filtered out.
		if ( auxiliaryMatches.length !== 0 ) {
			sentenceParts.push( new SentencePart( sentencePart, auxiliaryMatches ) );
		}
	}
	return sentenceParts;
};

/**
 * Split the sentence in sentence parts based on auxiliaries.
 *
 * @param {string} sentence The sentence to split in parts.
 * @returns {Array} A list with sentence parts.
 */
module.exports = function( sentence ) {
	return getSentenceParts( sentence );
};
