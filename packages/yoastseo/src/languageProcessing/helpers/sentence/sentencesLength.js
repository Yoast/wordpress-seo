import wordCount from "../word/countWords.js";
import { forEach } from "lodash-es";
import { stripFullTags as stripHTMLTags } from "../sanitize/stripHTMLTags.js";

/**
 * Returns an array with the length of each sentence.
 *
 * @param {Array} sentences Array with sentences from text.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {Array} Array with the length of each sentence.
 */
export default function( sentences, researcher ) {
	const sentencesWordCount = [];
	forEach( sentences, function( sentence ) {
		// For counting words we want to omit the HTMLtags.
		const strippedSentence = stripHTMLTags( sentence );
		// A helper to count characters for languages that don't count number of words for text length.
		const countCharacters = researcher.getHelper( "customCountLength" );
		const length = countCharacters ? countCharacters( strippedSentence ) : wordCount( strippedSentence );
		if ( length <= 0 ) {
			return;
		}

		sentencesWordCount.push( {
			sentence: sentence,
			sentenceLength: length,
		} );
	} );
	return sentencesWordCount;
}
