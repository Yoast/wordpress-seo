import { languageProcessing } from "yoastseo";
const { determineSentencePartIsPassive } = languageProcessing;

import getParticiples from "./internal/getParticiples";

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string}  sentencePartText        The sentence part to determine voice for.
 * @param {Array}   sentencePartAuxiliaries A list with auxiliaries in this sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
export default function isPassiveSentencePart( sentencePartText, sentencePartAuxiliaries ) {
	const participles = getParticiples( sentencePartText, sentencePartAuxiliaries );

	return determineSentencePartIsPassive( participles );
}
