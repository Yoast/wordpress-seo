import areWordsInSentence from "../../../helpers/areWordsInSentence";
import getPassiveVerbs from "../config/passiveVoice/participlesShortenedList.js";

/**
 * Checks the passed sentence to see if it contains passive verbs.
 *
 * @param {string} sentence The sentence to match against.
 * @returns {Boolean} Whether the sentence contains passive voice.
 */
export default function isPassiveSentence( sentence ) {
	return areWordsInSentence( getPassiveVerbs().all, sentence );
}
