import sentencesLength from "../helpers/sentence/sentencesLength.js";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";

/**
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * Gets the sentences from the text and calculates the length of each sentence.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {SentenceLength[]} The sentences from the text.
 */
export default function( paper, researcher ) {
	const sentences = getSentencesFromTree( paper.getTree() );
	return sentencesLength( sentences, researcher );
}
