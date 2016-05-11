var getSentences = require( "../stringProcessing/getSentences.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var cleanText = require( "../stringProcessing/cleanText.js" );
var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var nonverbEndingEd = require( "../language/en_US/non-verb-ending-ed.js" )();
var determiners = require( "../language/en_US/determiners.js" )();

var auxiliaries = require( "../language/en_us/auxiliaries.js" )();
var irregulars = require( "../language/en_us/irregulars.js" )();
var stopwords = require( "../language/en_us/stopwords.js" )();

var auxiliariesExceptions = require( "../language/en_us/auxiliariesExceptions.js" )();
var filter = require( "lodash/filter");
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );

var auxiliaryRegex = arrayToRegex( auxiliaries );

/**
 * Matches string with an array, returns the word and the index it was found on
 * @param {string} sentence The sentence to match the strings from the array to.
 * @param {Array} matchArray The array with strings to match
 * @returns {Array} The array with matches, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
var matchArray = function( sentence, matchArray ) {
	var matches = matchArray;
	var matchedParts = [];
	matches.map( function( part ){
		part = stripSpaces( part );

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

/**
 *
 * @param {Array} indices The array with indices
 * @returns {Array}
 */
var sortIndices = function( indices ){
	return indices.sort( function( a, b ){
		return( a.index > b.index );
	});
};

var filterIndices = function( indices ){
	indices = sortIndices( indices );
	for( var i = 0; i < indices.length; i++ ){
		if( !isUndefined( indices[ i + 1] ) && indices[ i+1 ].index < indices[ i ].index + indices[ i ].match.length ){
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

	var ingVerbs = getVerbsEndingInIng( subSentence );
	var ingVerbsIndices = matchArray( subSentence, ingVerbs );

	var indices = auxiliaryIndices.concat( stopwordIndices, ingVerbsIndices );


	return sortIndices( indices );
};

var getIngVerbIndices = function( subSentence ){

}

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

var getVerbsEndingInIng = function( sentence ){

	// matches the sentences with words ending in ing
	var matches = sentence.match( /\w+ing($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig ) || [];

	// if one of these words is in the sub sentence, we should ignore
	/*var exclusionArray = [ "being", "get", "gets", "getting", "got", "gotten", "having" ];
	var exclusionIndices = matchArray( sentence, exclusionArray );
	matches = filter( matches, function( match ){
		return exclusionIndices.length === 0
	} );*/

	exclusionArray = [ "king", "cling", "ring", "being" ];

	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ){
		return matchArray( stripSpaces( match ), exclusionArray ).length === 0;
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

var getExceptions = function( subSentence, verbs ){

	//match having with verb directly following
	var indexOfHaving = subSentence.indexOf( "having" );
	if( indexOfHaving > -1 ){
		var verbIndices = matchArray( subSentence, verbs );

		// 7 is the number of characters of the word 'having'
		if( verbIndices[0].index <= subSentence.indexOf( "having" ) + 7 ){
			return true;
		}
	}

	//match the left
	var matchLeft = subSentence.match( /(the|a)\sleft/ig ) || [];
	if( matchLeft.length > 0 && verbs[ 0 ].match === "left" ){
		return true;
	}

	//match fit
	var indexOfFit = subSentence.indexOf( "fit" );
	if( indexOfFit >  -1 ){
		var subString = subSentence.substr( 0,indexOfFit );
		var determinerIndices = matchArray( subString, determiners );
		if( determinerIndices.length > 1 ){
			return true;
		}
	}
	return false;
};

/**
 * Determines the number of passive sentences in the text.
 * @param {Paper} paper The paper object to get the text from.
 * @returns {number} The number of passives found in the text.
 */
module.exports = function( paper) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var passiveCount = 0;

	// get subsentences for each sentence.
	sentences.map( function( sentence ) {

		var subSentences = getSubsentences( sentence );
		var passive = false;
		subSentences.map( function( subSentence ) {

			var regularVerbs = getVerbs( subSentence );
			var irregularVerbs = getIrregularVerbs( subSentence );
			var verbs = regularVerbs.concat( irregularVerbs );
			var exceptions = getExceptions( subSentence, verbs );
			if( verbs.length > 0 && !exceptions ){
				passive = true;
			}
		} );
		if( passive ){
			passiveCount++;
			passive = false;
		}
	} );

	return passiveCount;
};
