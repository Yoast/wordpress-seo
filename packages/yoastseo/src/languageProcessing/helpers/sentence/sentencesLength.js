import wordCount from "../word/countWords.js";
import { forEach } from "lodash-es";
import { stripFullTags as stripHTMLTags } from "../sanitize/stripHTMLTags.js";

/**
 * Returns an array with the number of words in a sentence.
 *
 * @param {Array} sentences Array with sentences from text.
 *
 * @returns {Array} Array with amount of words in each sentence.
 */
export default function( sentences ) {
	const sentencesWordCount = [];
	forEach( sentences, function( sentence ) {
		// For counting words we want to omit the HTMLtags.
		const strippedSentence = stripHTMLTags( sentence );
		const length = wordCount( strippedSentence );

		if ( length <= 0 ) {
			return;
		}

		sentencesWordCount.push( {
			sentence: strippedSentence,
			sentenceLength: wordCount( strippedSentence ),
		} );
	} );
	return sentencesWordCount;
}
