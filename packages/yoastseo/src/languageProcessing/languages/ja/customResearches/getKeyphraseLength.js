import getWords from "../helpers/getWords";
import characterCountHelper from "../helpers/wordsCharacterCount";

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
