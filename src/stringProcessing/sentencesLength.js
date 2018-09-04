import wordCount from './countWords.js';
import { forEach } from "lodash-es";
import { stripFullTags as stripHTMLTags } from './stripHTMLTags.js';

/**
 * Returns an array with the number of words in a sentence.
 * @param {Array} sentences Array with sentences from text.
 * @returns {Array} Array with amount of words in each sentence.
 */
export default function( sentences ) {
	var sentencesWordCount = [];
	forEach( sentences, function( sentence ) {
		// For counting words we want to omit the HTMLtags.
		var strippedSentence = stripHTMLTags( sentence );
		var length = wordCount( strippedSentence );

		if ( length <= 0 ) {
			return;
		}

		sentencesWordCount.push( {
			sentence: sentence,
			sentenceLength: wordCount( sentence ),
		} );
	} );
	return sentencesWordCount;
};
