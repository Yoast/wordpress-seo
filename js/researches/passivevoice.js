var getSentences = require( "../stringProcessing/getSentences.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var cleanText = require( "../stringProcessing/cleanText.js" );
var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

var nonverbEndingEd = require( "../language/en_US/non-verb-ending-ed.js" )();
var nonverbEndingIng = require( "../language/en_US/non-verb-ending-ing.js" )();

var auxiliaries = require( "../language/en_us/auxiliaries.js" )();
var irregulars = require( "../language/en_us/irregulars.js" )();
var stopwords = require( "../language/en_us/stopwords.js" )();

var auxiliariesExceptions = require( "../language/en_us/auxiliariesExceptions.js" )();
var filter = require( "lodash/filter");
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );

var auxiliaryRegex = arrayToRegex( auxiliaries );

/**
 * Matches sentence on auxiliary words.
 * @param sentence
 */
var matchArray = function( sentence, matchArray ) {
	var matches = matchArray;
	var matchedParts = [];
	matches.map( function( part ){

		// search for each part in the array and filter on index -1
		var index = sentence.search( stringToRegex( part ) );
		if( index > -1 ){
			matchedParts.push(
				{
					index: index,
					match: part
				}
			)
		}
	} );
	return matchedParts;
};

var sortIndices = function( indices ){
	return indices.sort( function( a, b ){
		return( a.index > b.index );
	});
};

var filterIndices = function( indices ){
	indices = sortIndices( indices );
	for( var i = 0; i < indices.length; i++ ){
		if(typeof( indices[ i + 1] ) !== "undefined" && indices[ i+1 ].index < indices[ i ].index + indices[ i ].match.length ){
			console.log( "pop" );
			indices.pop( i + 1);
		}
	}
	return indices;
};

/**
 * Gets the indexes of the auxiliaries and stopwords to determine subsentences.
 * @param subSentence
 * @returns {Array.<T>}
 */
var getIndices = function( subSentence ){
	var auxiliaryIndices = matchArray( subSentence, auxiliaries );
	auxiliaryIndices = filterIndices( auxiliaryIndices );
	var stopwordIndices = matchArray( subSentence, stopwords );
	stopwordIndices = filterIndices( stopwordIndices );
	var indices = auxiliaryIndices.concat( stopwordIndices );
//console.log( sortIndices( indices ) );
	return sortIndices( indices );
};

/**
 *
 * @param sentence
 * @returns {Array}
 */
var getSubsentences = function( sentence ){

	var subSentences = [];
	// First check if there is an auxiliary word in the sentence

	if( sentence.match( auxiliaryRegex ) !== null ) {
		var indices = getIndices( sentence );
		var currentIndex = 0;

		// Get the words after the found auxiliary
		for( var i = 0; i < indices.length; i++ ) {
			var endIndex = sentence.length;
			if( typeof( indices[ i + 1 ] ) !== "undefined" ) {
				endIndex = indices[ i + 1 ].index;
			}

			// Cut the sentence from the current index to the endIndex
			var subSentence = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );

			currentIndex = endIndex;
			subSentences.push( subSentence );
		}
	}

	subSentences = filter ( subSentences, function( subSentence ) {
		return subSentence.match( auxiliaryRegex ) !== null;
	} );

	return subSentences;
};

/**
 *
 * @param sentence
 */
var getVerbs = function( sentence ){
	var verbs;

	// matches the sentences with words ending in ed
	var matches = sentence.match( /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig ) || [];

	// Filters out words ending in -ed that aren't verbs.
	return filter( matches, function( match ){
		return matchArray( stripSpaces( match ), nonverbEndingEd ).length === 0;
	} );
};

var getIrregularVerbs = function( sentence ) {
	var irregularVerbs = matchArray( sentence, irregulars );
	return filter( irregularVerbs, function( verb ){
		// If rid is used with get, gets, getting, got or gotten, remove it.
		if( verb.match === "rid" ){
			var exclusionArray = [ "get", "gets", "getting", "got", "gotten" ];
			if( matchArray( sentence, exclusionArray).length > 0 ){
				return false;
			}
		}
		return true;
	} );
};

/**
 *
 * @param paper
 */
module.exports = function( paper) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var passiveCount = 0;

	// get subsentences for each sentence.
	sentences.map( function( sentence ) {

		var subSentences = getSubsentences( sentence );
//console.log( subSentences );
		subSentences.map( function( subSentence ){
			var verbs = getVerbs( subSentence );
			var irregularVerbs = getIrregularVerbs( subSentence );
			if( verbs.length > 0 || irregularVerbs.length > 0 ){
				passiveCount++
			}
		} );
	} );

	return passiveCount;
};
