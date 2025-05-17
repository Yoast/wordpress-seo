import { getWordsFromTokens } from "../word/getAllWordsFromTree";

/**
 * @typedef {import("../../../languageProcessing/AbstractResearcher").default} Researcher
 * @typedef {import("../../../parse/structure/Sentence").default} Sentence
 * @typedef {import("../../../parse/structure/Token").default} Token
 */

/**
 * @typedef {Object} SentenceLength
 * @property {Sentence} sentence The sentence.
 * @property {number} sentenceLength The length of the sentence.
 * @property {Token} firstToken The first token of the sentence.
 * @property {Token} lastToken The last token of the sentence.
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
	const customLengthHelper = researcher.getHelper( "customCountLength" );

	return sentences.map( sentence => {
		const length = customLengthHelper ? customLengthHelper( sentence.text ) : getWordsFromTokens( sentence.tokens, false ).length;

		if ( length > 0 ) {
			return {
				sentence: sentence,
				sentenceLength: length,
				firstToken: sentence.getFirstToken() || null,
				lastToken: sentence.getLastToken() || null,
			};
		}
	} ).filter( Boolean );
}
