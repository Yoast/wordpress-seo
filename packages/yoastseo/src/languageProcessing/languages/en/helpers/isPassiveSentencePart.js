import { languageProcessing } from "yoastseo";
const { determineSentencePartIsPassive } = languageProcessing;

import getAndCheckParticiples from "./internal/getParticiples";

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string}  sentencePartText        The sentence part to determine voice for.
 * @param {Array}   sentencePartAuxiliaries A list with auxiliaries in this sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
export default function isPassiveSentencePart( sentencePartText, sentencePartAuxiliaries ) {
	const participles = getAndCheckParticiples( sentencePartText, sentencePartAuxiliaries );

	return determineSentencePartIsPassive( participles );
}
