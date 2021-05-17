import { languageProcessing } from "yoastseo";
const { determineSentencePartIsPassive } = languageProcessing;

import getParticiples from "./internal/getParticiples";
import passiveVoiceAuxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
const auxiliaries = passiveVoiceAuxiliaries.all;

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string}  sentencePartText        The sentence part to determine voice for.
 * @param {Array}   sentencePartAuxiliaries A list with auxiliaries in this sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
export default function isPassiveSentencePart( sentencePartText, sentencePartAuxiliaries ) {
	if ( ! sentencePartAuxiliaries.some( auxiliary => auxiliaries.includes( auxiliary ) ) ) {
		return false;
	}

	const participles = getParticiples( sentencePartText, sentencePartAuxiliaries );

	return determineSentencePartIsPassive( participles );
}
