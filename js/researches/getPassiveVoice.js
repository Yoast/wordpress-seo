var getSentences = require( "../stringProcessing/getSentences.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var stringToRegex = require( "../stringProcessing/stringToRegex.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var nonverbEndingEd = require( "./passivevoice-english/non-verb-ending-ed.js" )();
var determiners = require( "./passivevoice-english/determiners.js" )();

var auxiliaries = require( "./passivevoice-english/auxiliaries.js" )();
var irregulars = require( "./passivevoice-english/irregulars.js" )();
var stopwords = require( "./passivevoice-english/stopwords.js" )();

var filter = require( "lodash/filter" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );

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
	forEach( matches, function( part ) {
		part = stripSpaces( part );

		// Search for each part in the array and filter on index -1
		var index = sentence.search( stringToRegex( part ) );
		if ( index > -1 ) {
			matchedParts.push( { index: index, match: part } );
		}
	} );
	return matchedParts;
};

/**
 * Sorts the array on the index property of each entry.
 * @param {Array} indices The array with indices.
 * @returns {Array} The sorted array with indices.
 */
var sortIndices = function( indices ) {
	return indices.sort( function( a, b ) {
		return ( a.index > b.index );
	} );
};

/**
 * Filters duplicate entries if the indices overlap.
 * @param {Array} indices The array with indices to be filtered
 * @returns {Array} The filtered array
 */
var filterIndices = function( indices ) {
	indices = sortIndices( indices );
	for ( var i = 0; i < indices.length; i++ ) {

		// If the next index is within the range of the current index and the length of the word, remove it
		// This makes sure we don't match combinations twice, like "even though" and "though".
		if ( !isUndefined( indices[ i + 1 ] ) && indices[ i + 1 ].index < indices[ i ].index + indices[ i ].match.length ) {
			indices.pop( i + 1 );
		}
	}
	return indices;
};

/**
 * Gets active verbs (ending in ing) to determine sentence breakers.
 * @param {string} sentence The sentence to get the active verbs from.
 * @returns {Array} The array with valid matches.
 */
var getVerbsEndingInIng = function( sentence ) {

	// Matches the sentences with words ending in ing
	var matches = sentence.match( /\w+ing($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig ) || [];

	var exclusionArray = [ "king", "cling", "ring", "being" ];

	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return matchArray( stripSpaces( match ), exclusionArray ).length === 0;
	} );
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and active verbs) to determine subsentences.
 * Stopwords are filtered because they can contain duplicate matches, like "even though" and "though".
 * @param {string} sentence The sentence to check for indices of auxiliaries, stopwords and active verbs
 * @returns {Array} The array with valid indices to use for determining subsentences.
 */
var getSentenceBreakers = function( sentence ) {
	var auxiliaryIndices = matchArray( sentence, auxiliaries );

	var stopwordIndices = matchArray( sentence, stopwords );
	stopwordIndices = filterIndices( stopwordIndices );

	var ingVerbs = getVerbsEndingInIng( sentence );
	var ingVerbsIndices = matchArray( sentence, ingVerbs );

	// Concat all indices arrays and sort them.
	var indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices );
	return sortIndices( indices );
};

/**
 * Gets the subsentences from a sentence by determining sentence breakers
 * @param {string} sentence The sentence to split up in subsentences
 * @returns {Array} The array with all subsentences of a sentence that have an auxiliary
 */
var getSubsentences = function( sentence ) {
	var auxiliaryRegex = arrayToRegex( auxiliaries );
	var subSentences = [];

	// First check if there is an auxiliary word in the sentence
	if( sentence.match( auxiliaryRegex ) !== null ) {
		var indices = getSentenceBreakers( sentence );

		// Get the words after the found auxiliary
		for ( var i = 0; i < indices.length; i++ ) {
			var endIndex = sentence.length;
			if ( !isUndefined( indices[ i + 1 ] ) ) {
				endIndex = indices[ i + 1 ].index;
			}

			// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
			var subSentence = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );
			subSentences.push( subSentence );
		}
	}

	// If a subsentence doesn't have an auxiliary, we don't need it, so it can be filtered out.
	subSentences = filter( subSentences, function( subSentence ) {
		return subSentence.match( auxiliaryRegex ) !== null;
	} );

	return subSentences;
};

/**
 * Gets regular passive verbs.
 * @param {string} subSentence The sub sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getRegularVerbs = function( subSentence ) {

	// Matches the sentences with words ending in ed
	var matches = subSentence.match( /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig ) || [];

	// Filters out words ending in -ed that aren't verbs.
	return filter( matches, function( match ) {

		// Strips spaces from the match
		return matchArray( stripSpaces( match ), nonverbEndingEd ).length === 0;
	} );
};

/**
 * Gets irregular passive verbs
 * @param {string} subSentence The sub sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getIrregularVerbs = function( subSentence ) {
	var irregularVerbs = matchArray( subSentence, irregulars );
	return filter( irregularVerbs, function( verb ) {
		// If rid is used with get, gets, getting, got or gotten, remove it.
		if ( verb.match === "rid" ) {
			var exclusionArray = [ "get", "gets", "getting", "got", "gotten" ];
			if ( matchArray( subSentence, exclusionArray ).length > 0 ) {
				return false;
			}
		}
		return true;
	} );
};

/**
 * Matches having with a verb directly following it. If so, it is not passive.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isHavingException = function( subSentence, verbs ) {

	// Match having with a verb directly following it. If so it is active.
	var indexOfHaving = subSentence.indexOf( "having" );
	if ( indexOfHaving > -1 ) {
		var verbIndices = matchArray( subSentence, verbs );

		// 7 is the number of characters of the word 'having' including space
		return verbIndices[ 0 ].index <= subSentence.indexOf( "having" ) + 7;
	}
	return false;
};

/**
 * Match the left. If left is preceeded by `a` or `the`, it isn't a verb.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isLeftException = function ( subSentence, verbs ) {

	// Matches left with the or a preceeding.
	var matchLeft = subSentence.match( /(the|a)\sleft/ig ) || [];
	return matchLeft.length > 0 && verbs[ 0 ].match === "left";
};

/**
 * If the word 'fit' is preceeded by a determiner, it shouldn't be marked as active.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isFitException = function( subSentence ) {
	var indexOfFit = subSentence.indexOf( "fit" );
	if ( indexOfFit > -1 ) {
		var subString = subSentence.substr( 0, indexOfFit );
		var determinerIndices = matchArray( subString, determiners );
		return determinerIndices.length > 1;
	}
	return false;
};

/**
 * Gets the exceptions. Some combinations shouldn't be marked as passive, so we need to filter them out.
 * @param {string} subSentence The subsentence to check for exceptions.
 * @param {array} verbs The array of verbs, used to determine exceptions.
 * @returns {boolean} Wether there is an exception or not.
 */
var getExceptions = function( subSentence, verbs ) {
	var havingException = isHavingException( subSentence, verbs );
	var leftException = isLeftException( subSentence, verbs );
	var fitException = isFitException( subSentence );

	// If any of the exceptions is true, return true.
	return havingException || leftException || fitException;
};

/**
 * Checks the subsentence for any passive verb.
 * @param {string} subSentence The subsentence to check for passives.
 * @returns {boolean} True if passive is found, false if no passive is found.
 */
var determinePassives = function( subSentence ) {
	var regularVerbs = getRegularVerbs( subSentence );
	var irregularVerbs = getIrregularVerbs( subSentence );
	var verbs = regularVerbs.concat( irregularVerbs );

	// Checks for exceptions in the found verbs.
	var exceptions = getExceptions( subSentence, verbs );

	// If there is any exception, this subsentence cannot be passive.
	return verbs.length > 0 && exceptions === false;
};

/**
 * Determines the number of passive sentences in the text.
 * @param {Paper} paper The paper object to get the text from.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var passiveSentences = [];

	// Get subsentences for each sentence.
	forEach( sentences, function( sentence ) {
		var subSentences = getSubsentences( sentence );
		var passive = false;
		subSentences.map( function( subSentence ) {
			passive = determinePassives( subSentence );
		} );
		if ( passive ) {
			passiveSentences.push( sentence );
			passive = false;
		}
	} );

	return {
		total: sentences.length,
		passives: passiveSentences
	};
};
