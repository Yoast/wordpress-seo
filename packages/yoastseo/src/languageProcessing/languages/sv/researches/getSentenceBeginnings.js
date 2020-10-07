import getFirstWordExceptions from "../config/firstWordExceptions";
import getSentenceBeginnings from "../../../researches/base/getSentenceBeginnings";

const firstWordExceptions = getFirstWordExceptions();

/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 *
 * @param {Paper} paper The Paper object to get the text from.
 * @param {Researcher} researcher The researcher this research is a part of.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
export default function( paper, researcher ) {
	return getSentenceBeginnings( paper, researcher, firstWordExceptions );
}
