import getParticiples from "./internal/getParticiples";
import determineSentencePartIsPassive from "../../../helpers/passiveVoice/periphrastic/determineSentencePartIsPassive";
import auxiliaries from "../config/internal/auxiliaries.js";

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
