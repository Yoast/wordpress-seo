import sentencesLength from "../helpers/sentence/sentencesLength.js";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";

/**
 * Gets the sentences from the text and calculates the length of each sentence.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {SentenceLength[]} The sentences from the text.
 */
export default function( paper, researcher ) {
	const sentences = getSentencesFromTree( paper );
	return sentencesLength( sentences, researcher );
}
