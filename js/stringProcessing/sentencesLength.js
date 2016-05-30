var wordCount = require( "./countWords.js" );
var forEach = require( "lodash/forEach" );
var stripHTMLTags = require( "./stripHTMLTags.js" );

/**
 * Returns an array with the number of words in a sentence.
 * @param {Array} sentences Array with sentences from text.
 * @returns {Array} Array with amount of words in each sentence.
 */
module.exports = function( sentences ) {
	var sentencesWordCount = [];
	forEach( sentences, function( sentence ) {
		sentence = stripHTMLTags( sentence );
		var length = wordCount( sentence );

		if ( length <= 0 ) {
			return;
		}

		sentencesWordCount.push( {
			sentence: sentence,
			sentenceLength: wordCount( sentence )
		} );
	} );

	return sentencesWordCount;
};
