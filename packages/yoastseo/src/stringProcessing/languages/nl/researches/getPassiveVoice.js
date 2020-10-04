import { getPeriphrasticPassives } from "../../../abstract/getPassiveVoice";
import isPassiveSentencePart from "../helpers/isPassiveSentencePart";
import getSentenceParts from "../helpers/getSentenceParts";

/**
 * Determines the number of passive sentences in the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Object} The total number of sentences in the text and the found passive sentences.
 */
export default function( paper ) {
	return getPeriphrasticPassives( paper, getSentenceParts, isPassiveSentencePart );
}
