var transitionWords = require( "../config/transitionWords.js" );
var twoPartTransitionWords = require( "../config/twoPartTransitionWords.js" );
var createRegexFromDoubleArray = require( "../stringProcessing/createRegexFromDoubleArray.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );
var createRegexFromArray = require( "../stringProcessing/createRegexFromArray.js" );
var forEach = require( "lodash/forEach" );

/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {object} An object with the total number of sentences in the text
 * and the total number of sentences containing one or more transition words.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );

	var sentenceResults = [];
	var transitionWordSentenceCount = 0;

	var twoPartTransitionWordRegex = createRegexFromDoubleArray( twoPartTransitionWords() );
	var transitionWordRegex = createRegexFromArray( transitionWords() );

	forEach( sentences, function( sentence ) {
		var twoPartMatches = sentence.match( twoPartTransitionWordRegex );

		if ( twoPartMatches !== null ) {
			sentenceResults.push( {
				sentence: sentence,
				transitionWords: twoPartMatches
			} );

			transitionWordSentenceCount++;
			return;
		}

		var transitionWordMatches = sentence.match( transitionWordRegex );

		if ( transitionWordMatches !== null ) {
			sentenceResults.push( {
				sentence: sentence,
				transitionWords: transitionWordMatches
			} );

			transitionWordSentenceCount++;
			return;
		}
	} );

	return {
		totalSentences: sentences.length,
		transitionWordSentences: transitionWordSentenceCount,
		sentenceResults: sentenceResults
	};
};
