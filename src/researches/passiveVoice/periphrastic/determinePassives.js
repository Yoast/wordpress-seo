import getParticiples from './getParticiples.js';
import determineSentencePartIsPassive from './determineSentencePartIsPassive.js';

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePart The sentence part to determine voice for.
 * @param {Array} auxiliaries The auxiliaries to be used for creating SentenceParts.
 * @param {string} language The language to determine voice for.
 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
export default function( sentencePart, auxiliaries, language ) {
	let participles = getParticiples( sentencePart, auxiliaries, language );
	return determineSentencePartIsPassive( participles );
};
