var getSentences = require( "../../../stringProcessing/getSentences.js" );
var stopwords = require( "../../german/passivevoice-german/stopwords.js" )();
var arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );
var stripSpaces = require( "../../../stringProcessing/stripSpaces.js" );

var forEach = require( "lodash/forEach" );
var isEmpty = require( "lodash/isEmpty" );

var stopwordRegex = arrayToRegex( stopwords );

/**
 * Splits sentences into subsentences based on stopwords.
 *
 * @param {string} sentence The sentence to split.
 * @param {Array} matches The array with matched stopwords.
 * @returns {Array} The array with subsentences.
 */
function splitOnWord( sentence, matches ) {
	var currentSentence = sentence;
	var subSentences = [];
	forEach( matches, function( match ) {
		var splitSentence = currentSentence.split( match );
		if ( ! isEmpty( splitSentence[ 0 ] ) ) {
			subSentences = subSentences.concat( splitSentence[ 0 ] );
		}
		var startIndex = currentSentence.indexOf( match );
		var endIndex = currentSentence.length;
		currentSentence = ( stripSpaces( currentSentence.substr( startIndex, endIndex ) ) );
	} );
	subSentences = subSentences.concat( stripSpaces( currentSentence ) );
	return subSentences;
}

/**
 * Splits the sentences from a text into subsentences based on stopwords.
 *
 * @param {string} text The text to split into subsentences.
 * @returns {Array} The array with subsentences.
 */
function splitSentences( text ) {
	var sentences = getSentences( text );
	var splitSentences = [];
	forEach( sentences, function( sentence ) {
		var matches = sentence.match( stopwordRegex ) || [];
		splitSentences = splitSentences.concat( splitOnWord( sentence, matches ) );
	} );
	return splitSentences;
}

module.exports = function( text ) {
	return splitSentences( text );
};
