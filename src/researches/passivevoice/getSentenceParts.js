var verbEndingInIngRegex = /\w+ing(?=$|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var ingExclusionArray = [ "king", "cling", "ring", "being", "thing", "something", "anything" ];
var reflexivePronounsFrench = [ "se", "me", "te", "s'y", "m'y", "t'y", "nous nous", "vous vous" ];

var indices = require( "../../stringProcessing/indices" );
var getIndicesOfList = indices.getIndicesByWordList;
var filterIndices = indices.filterIndices;
var sortIndices = indices.sortIndices;
var stripSpaces = require( "../../stringProcessing/stripSpaces.js" );
var normalizeSingleQuotes = require( "../../stringProcessing/quotes.js" ).normalizeSingle;
var arrayToRegex = require( "../../stringProcessing/createRegexFromArray.js" );
var getWordIndices = require( "./getIndicesWithRegex.js" );
var includesIndex = require( "../../stringProcessing/includesIndex" );
var followsIndex = require( "../../stringProcessing/followsIndex" );

var directPrecedenceExceptionRegex = arrayToRegex( reflexivePronounsFrench );
var followingAuxiliaryExceptionWords = [ "le", "la", "les", "une", "l'un", "l'une" ];
var followingAuxiliaryExceptionRegex = arrayToRegex( followingAuxiliaryExceptionWords );

var auxiliariesFrench = require( "../french/passivevoice/auxiliaries.js" )();
var auxiliariesEnglish = require( "../english/passivevoice/auxiliaries.js" )().all;

var stopwordsFrench = require( "../french/passivevoice/stopwords.js" )();
var stopwordsEnglish = require( "../english/passivevoice/stopwords.js" )();

var SentencePartEnglish = require( "../english/SentencePart" );
var SentencePartFrench = require( "../french/SentencePart" );

var filter = require( "lodash/filter" );
var isUndefined = require( "lodash/isUndefined" );
var includes = require( "lodash/includes" );
var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );

// The language-specific variables.
var languageVariables = {
	en: {
		stopwords: stopwordsEnglish,
		auxiliaryRegex: arrayToRegex( auxiliariesEnglish ),
		SentencePart: SentencePartEnglish,
		auxiliaries: auxiliariesEnglish,
		stopCharacterRegex: /(?!([a-zA-Z]))([:,]|('ll)|('ve))(?=[ \n\r\t\'\"\+\-»«‹›<>])/ig,
	},
	fr: {
		stopwords: stopwordsFrench,
		auxiliaryRegex: arrayToRegex( auxiliariesFrench ),
		SentencePart: SentencePartFrench,
		auxiliaries: auxiliariesFrench,
		stopCharacterRegex: /(?!([a-zA-Z]))(,)(?=[ \n\r\t\'\"\+\-»«‹›<>])/ig,
	},
};

/**
 * Gets active verbs (ending in ing) to determine sentence breakers in English.
 *
 * @param {string} sentence The sentence to get the active verbs from.
 * @returns {Array} The array with valid matches.
 */
var getVerbsEndingInIng = function( sentence ) {
	// Matches the sentences with words ending in ing.
	var matches = sentence.match( verbEndingInIngRegex ) || [];
	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return ! includes( ingExclusionArray, stripSpaces( match ) );
	} );
};

/**
 * Gets stop characters to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the stop characters from.
 * @param {string} language The language for which to get the stop characters.
 * @returns {Array} The array with valid matches.
 */
var getStopCharacters = function( sentence, language ) {
	var stopCharacterRegex = languageVariables[ language ].stopCharacterRegex;
	var match;
	var matches = [];

	stopCharacterRegex.lastIndex = 0;

	while ( ( match = stopCharacterRegex.exec( sentence ) ) !== null ) {
		matches.push(
			{
				index: match.index,
				match: match[ 0 ],
			}
		);
	}
	return matches;
};

/**
 * 	Filters auxiliaries preceded by a reflexive pronoun.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @returns {Array} The filtered list of auxiliary indices.
 */
var auxiliaryPrecedenceException = function( text, auxiliaryMatches ) {
	var directPrecedenceExceptionMatches = getWordIndices( text, directPrecedenceExceptionRegex );

	forEach( auxiliaryMatches, function( auxiliaryMatch ) {
		if ( includesIndex( directPrecedenceExceptionMatches, auxiliaryMatch.index ) ) {
			auxiliaryMatches = auxiliaryMatches.filter( function( auxiliaryObject ) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			} );
		}
	} );

	return auxiliaryMatches;
};

/**
 * 	Filters auxiliaries followed by a word on the followingAuxiliaryExceptionWords list
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @returns {Array} The filtered list of auxiliary indices.
 */
var followingAuxiliaryException = function( text, auxiliaryMatches ) {
	var followingAuxiliaryExceptionMatches = getWordIndices( text, followingAuxiliaryExceptionRegex );

	forEach( auxiliaryMatches, function( auxiliaryMatch ) {
		if ( followsIndex( followingAuxiliaryExceptionMatches, auxiliaryMatch ) ) {
			auxiliaryMatches = auxiliaryMatches.filter( function( auxiliaryObject ) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			} );
		}
	} );

	return auxiliaryMatches;
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and stop characters;
 * in English also active verbs) to determine sentence parts.
 * Indices are filtered because there could be duplicate matches, like "even though" and "though".
 * In addition, 'having' will be matched both as a -ing verb as well as an auxiliary.
 *
 * @param {string} sentence The sentence to check for indices of sentence breakers.
 * @param {string} language The language for which to match the sentence breakers.
 * @returns {Array} The array with valid indices to use for determining sentence parts.
 */
var getSentenceBreakers = function( sentence, language ) {
	sentence = sentence.toLocaleLowerCase();
	var stopwords = languageVariables[ language ].stopwords;
	var auxiliaries = languageVariables[ language ].auxiliaries;
	var auxiliaryIndices = getIndicesOfList( auxiliaries, sentence );
	var stopwordIndices = getIndicesOfList( stopwords, sentence );
	var stopCharacterIndices = getStopCharacters( sentence, language );
	var indices;

	// Concat all indices arrays, filter them and sort them.
	switch( language ) {
		case "fr":
			auxiliaryIndices = auxiliaryPrecedenceException( sentence, auxiliaryIndices );

			indices = [].concat( auxiliaryIndices, stopwordIndices, stopCharacterIndices );
			break;
		case "en":
		default:
			var ingVerbs = getVerbsEndingInIng( sentence );
			var ingVerbsIndices = getIndicesOfList( ingVerbs, sentence );
			indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices, stopCharacterIndices );
			break;
	}
	indices = filterIndices( indices );
	return sortIndices( indices );
};

/**
 * Gets the matches with the auxiliaries in the sentence.
 *
 * @param {string} sentencePart The part of the sentence to match for auxiliaries.
 * @param {string} language The language for which to match the auxiliaries.
 * @returns {Array} All formatted matches from the sentence part.
 */
var getAuxiliaryMatches = function( sentencePart, language ) {
	var auxiliaryRegex = languageVariables[ language ].auxiliaryRegex;
	var auxiliaryMatches = sentencePart.match( auxiliaryRegex ) || [];

	switch( language ) {
		case "fr":
			var auxiliaryMatchesOutput = [];
			var auxiliaryMatchIndices = getIndicesOfList( auxiliaryMatches, sentencePart );
			auxiliaryMatchIndices = auxiliaryPrecedenceException( sentencePart, auxiliaryMatchIndices );
			auxiliaryMatchIndices = followingAuxiliaryException( sentencePart, auxiliaryMatchIndices );

			forEach( auxiliaryMatchIndices, function( auxiliaryMatchIndex ) {
				auxiliaryMatchesOutput.push( auxiliaryMatchIndex.match );
			} );

			return map( auxiliaryMatchesOutput, function( auxiliaryMatch ) {
				return stripSpaces( auxiliaryMatch );
			} );
		case "en":
		default:
			return map( auxiliaryMatches, function( auxiliaryMatch ) {
				return stripSpaces( auxiliaryMatch );
			} );
	}
};

/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @param {string} language The language for which to get the sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
var getSentenceParts = function( sentence, language ) {
	var sentenceParts = [];
	var auxiliaryRegex = languageVariables[ language ].auxiliaryRegex;
	var SentencePart = languageVariables[ language ].SentencePart;

	sentence = normalizeSingleQuotes( sentence );

	// First check if there is an auxiliary in the sentence.
	if ( sentence.match( auxiliaryRegex ) === null ) {
		return sentenceParts;
	}

	var indices = getSentenceBreakers( sentence, language );
	// Get the words after the found auxiliary.
	for ( var i = 0; i < indices.length; i++ ) {
		var endIndex = sentence.length;
		if ( ! isUndefined( indices[ i + 1 ] ) ) {
			endIndex = indices[ i + 1 ].index;
		}

		// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
		var sentencePart = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );

		var auxiliaryMatches = getAuxiliaryMatches( sentencePart, language );
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
 * @param {string} language The language for which to get the sentence parts.
 * @returns {Array} A list with sentence parts.
 */
module.exports = function( sentence, language ) {
	return getSentenceParts( sentence, language );
};
