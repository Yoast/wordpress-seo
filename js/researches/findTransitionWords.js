var transitionWords = require( "../config/transitionWords.js" )();
var twoPartTransitionWords = require( "../config/twoPartTransitionWords.js" )();
var createRegexFromDoubleArray = require( "../stringProcessing/createRegexFromDoubleArray.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );
var createRegexFromArray = require( "../stringProcessing/createRegexFromArray.js" );
var filter = require( "lodash/filter" );

/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 * @param {string} paper The Paper object to get text from.
 * @returns {object} An object with the total number of sentences in the text
 * and the total number of sentences containing one or more transition words.
 */

module.exports = function( paper ) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var transitionWordSentenceCount = 0;
	var twoPartTransitionWordRegex = createRegexFromDoubleArray( twoPartTransitionWords );
	var transitionWordRegex = createRegexFromArray( transitionWords );
	var nonMatchedSentences = filter( sentences, function ( sentence ) {
		if( sentence.match ( twoPartTransitionWordRegex ) !== null ) {
			transitionWordSentenceCount++;
			return false;
		}
		return true;
	} );
	nonMatchedSentences.map ( function( sentence ) {
		if( sentence.match ( transitionWordRegex ) !== null ) {
			transitionWordSentenceCount++;
		}
	} );

	return {
		totalSentences: sentences.length,
		transitionWordSentences: transitionWordSentenceCount
	};
};
