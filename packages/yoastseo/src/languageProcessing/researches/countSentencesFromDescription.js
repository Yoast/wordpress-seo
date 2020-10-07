import getSentences from "../helpers/sentence/getSentences";
import sentencesLength from "../helpers/sentence/sentencesLength.js";

/**
 * Counts sentences in the description..
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
export default function( paper ) {
	const sentences = getSentences( paper.getDescription() );
	return sentencesLength( sentences );
}
