import transitionWordsEnglishFactory from "../config/transitionWords";
import twoPartTransitionWordsEnglish from "../config/twoPartTransitionWords";
import findTransitionWords from "../../../abstract/findTransitionWords";
const transitionWordsEnglish = transitionWordsEnglishFactory().allWords;

/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @returns {object} An object with the total number of sentences in the text
 * and the total number of sentences containing one or more transition words.
 */
export default function( paper ) {
	const transitionWords = {
		transitionWords: transitionWordsEnglish,
		twoPartTransitionWords: twoPartTransitionWordsEnglish,
	};

	return findTransitionWords( paper, transitionWords );
}
