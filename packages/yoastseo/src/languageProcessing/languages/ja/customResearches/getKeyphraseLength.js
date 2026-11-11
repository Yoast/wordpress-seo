import getWords from "../helpers/getWords.js";
import characterCountHelper from "../helpers/wordsCharacterCount.js";

/**
 * Calculates the character length of the keyphrase.
 *
 * @param {Paper} paper The paper to research
 *
 * @returns {Object} The length of the keyphrase and an empty array of function words.
 */
export default function( paper ) {
	const keyphrase = getWords( paper.getKeyword() );

	return {
		keyphraseLength: characterCountHelper( keyphrase ),
		// Returns empty array because we don't take function words into account for Japanese keyphrase length calculations.
		functionWords: [],
	};
}
