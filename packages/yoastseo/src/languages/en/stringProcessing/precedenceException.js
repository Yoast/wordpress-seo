import getWordIndices from "../researches/passiveVoice/getIndicesWithRegex.js";
import precedesIndex from "./precedesIndex";
import arrayToRegex from "./createRegexFromArray.js";
import cannotBeBetweenAuxiliaryAndParticipleFactory from "../config/passiveVoice/functionWords.js";
const cannotBeBetweenAuxiliaryAndParticiple =
	cannotBeBetweenAuxiliaryAndParticipleFactory().cannotBeBetweenPassiveAuxiliaryAndParticiple;

const precedenceExceptionRegex = arrayToRegex( cannotBeBetweenAuxiliaryAndParticiple );

/**
 * Checks whether a word from the precedence exception list occurs anywhere in the sentence part before the participle.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {number} participleIndex The index of the participle.
 *
 * @returns {boolean} Returns true if a word from the precedence exception list occurs anywhere in the
 * sentence part before the participle, otherwise returns false.
 */
export default function( sentencePart, participleIndex ) {
	const precedenceExceptionMatch = getWordIndices( sentencePart, precedenceExceptionRegex );
	return precedesIndex( precedenceExceptionMatch, participleIndex );
}
