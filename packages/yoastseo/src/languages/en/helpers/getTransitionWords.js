import transitionWordsFactory from "../config/passiveVoice/transitionWords.js";
const transitionWords = transitionWordsFactory().allWords;
import twoPartTransitionWordsEnglish from "../config/twoPartTransitionWords.js";

/**
 * Returns transition words for a specific locale.
 *
 * @returns {Object} The function words for a locale.
 */
export default function() {
	return {
		transitionWords: transitionWords,
		twoPartTransitionWords: twoPartTransitionWordsEnglish,
	};
}
