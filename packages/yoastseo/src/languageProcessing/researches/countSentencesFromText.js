import getSentences from "../helpers/sentence/getSentences";
import sentencesLength from "../helpers/sentence/sentencesLength.js";

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
export default function( paper ) {
	const sentences = getSentences( paper.getText() );
	return sentencesLength( sentences );
}
