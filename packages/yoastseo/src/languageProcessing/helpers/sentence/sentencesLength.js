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
	const customLengthHelper = researcher.getHelper( "customCountLength" );

	return sentences.map( sentence => {
		const { tokens } = sentence;
		const length = customLengthHelper ? customLengthHelper( sentence.text ) : getWordsFromTokens( tokens, false ).length;

		if ( length > 0 ) {
			const firstToken = tokens.find( ( { text } ) => text !== " " );
			const lastToken = tokens.slice().reverse().find( ( { text } ) => text !== " " );

			return {
				sentence: sentence,
				sentenceLength: length,
				firstToken: firstToken ? firstToken : null,
				lastToken: lastToken ? lastToken : null,
			};
		}
	} ).filter( Boolean );
}
