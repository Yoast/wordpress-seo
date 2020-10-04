import { getMorphologicalPassives } from "../../../abstract/getPassiveVoice";
import isPassiveSentence from "../helpers/isPassiveSentence";

/**
 * Determines the number of passive sentences in the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Object} The total number of sentences in the text and the found passive sentences.
 */
export default function getPassiveVoice( paper ) {
	return getMorphologicalPassives( paper, isPassiveSentence );
}
