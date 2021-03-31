import { languageProcessing } from "yoastseo";
const { areWordsInSentence } = languageProcessing;

import passiveVerbs from "../config/internal/passiveVerbs";

/**
 * Checks the passed sentence to see if it contains passive verbs.
 *
 * @param {string} sentence The sentence to match against.
 * @returns {Boolean} Whether the sentence contains passive voice.
 */
export default function isPassiveSentence( sentence ) {
	return areWordsInSentence( passiveVerbs, sentence );
}
