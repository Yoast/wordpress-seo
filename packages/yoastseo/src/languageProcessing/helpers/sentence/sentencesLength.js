import { getWordsFromTokens } from "../word/getAllWordsFromTree";

/**
 * @typedef {Object} SentenceLength
 * @property {Sentence} sentence The sentence.
 * @property {number} sentenceLength The length of the sentence.
 */

/**
 * Returns an array with the length of each sentence.
 *
 * @param {Sentence[]} sentences Array with sentences from text.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {SentenceLength[]} Array with the length of each sentence.
 */
export default function( sentences, researcher ) {
	const sentencesWordCount = [];
	sentences.forEach( sentence => {
		const customLengthHelper = researcher.getHelper( "customCountLength" );
		const length = customLengthHelper ? customLengthHelper( sentence.text ) : getWordsFromTokens( sentence.tokens, false ).length;
		if ( length > 0 ) {
			sentencesWordCount.push( {
				sentence: sentence,
				sentenceLength: length,
			} );
		}
	} );
	return sentencesWordCount;
}
