import getSentences from "../helpers/getSentences";
import sentencesLength from "../helpers/sentencesLength.js";

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
export default function( paper ) {
	const sentences = getSentences( paper.getText() );
	return sentencesLength( sentences );
}
