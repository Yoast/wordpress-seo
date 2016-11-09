var verbEndingInIngRegex = /\w+ing($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var ingExclusionArray = [ "king", "cling", "ring", "being" ];
var getIndicesOfList = require( "../../stringProcessing/indices" ).getIndicesByWordList;
var filterIndices = require( "../../stringProcessing/indices" ).filterIndices;
var sortIndices = require( "../../stringProcessing/indices" ).sortIndices;
var stripSpaces = require( "../../stringProcessing/stripSpaces.js" );
var normalizeSingleQuotes = require( "../../stringProcessing/quotes.js" ).normalizeSingle;
var arrayToRegex = require( "../../stringProcessing/createRegexFromArray.js" );

var auxiliaries = require( "./passivevoice-english/auxiliaries.js" )().all;
var SentencePart = require( "./EnglishSentencePart.js" );
var auxiliaryRegex = arrayToRegex( auxiliaries );
var stopwords = require( "./passivevoice-english/stopwords.js" )();

var filter = require( "lodash/filter" );
var isUndefined = require( "lodash/isUndefined" );
var includes = require( "lodash/includes" );
var map = require( "lodash/map" );

/**
 * Gets active verbs (ending in ing) to determine sentence breakers.
 *
	* @param {string} sentence The sentence to get the active verbs from.
	* @returns {Array} The array with valid matches.
	*/
var getVerbsEndingInIng = function( sentence ) {
	// Matches the sentences with words ending in ing
	var matches = sentence.match( verbEndingInIngRegex ) || [];

	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return ! includes( ingExclusionArray, stripSpaces( match ) );
	} );
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and active verbs) to determine sentence parts.
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

	var ingVerbs = getVerbsEndingInIng( sentence );
	var ingVerbsIndices = getIndicesOfList( ingVerbs, sentence );

	// Concat all indices arrays, filter them and sort them.
	var indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices );
	indices = filterIndices( indices );
	return sortIndices( indices );
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
	if ( sentence.match( auxiliaryRegex ) !== null ) {
		var indices = getSentenceBreakers( sentence );
		// Get the words after the found auxiliary.
		for ( var i = 0; i < indices.length; i++ ) {
			var endIndex = sentence.length;
			if ( ! isUndefined( indices[ i + 1 ] ) ) {
				endIndex = indices[ i + 1 ].index;
			}

			// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
			var sentencePart = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );

			var auxiliaryMatches = sentencePart.match( auxiliaryRegex );

				// If a sentence part doesn't have an auxiliary, we don't need it, so it can be filtered out.
			if ( auxiliaryMatches !== null ) {
				auxiliaryMatches = map( auxiliaryMatches, function( auxiliaryMatch ) {
					return stripSpaces( auxiliaryMatch );
				} );
				sentenceParts.push( new SentencePart( sentencePart, auxiliaryMatches ) );
			}
		}
	}
	return sentenceParts;
};

module.exports = function( sentence ) {
	return getSentenceParts( sentence );
};
