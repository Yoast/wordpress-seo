import getWordIndices from "../passiveVoice/periphrastic/getIndicesWithRegex.js";
import precedesIndex from "../word/precedesIndex";
import arrayToRegex from "../regex/createRegexFromArray.js";

/**
 * Checks whether a word from the precedence exception list occurs anywhere in the sentence part before the participle.
 * If this is the case, the sentence part is not passive.
 *
 * @todo: seems this isn't used anywhere.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {number} participleIndex The index of the participle.
 * @param {Array} cannotBeBetweenAuxiliaryAndParticipleList List of words which cannot be between auxiliary and participle.
 *
 * @returns {boolean} Returns true if a word from the precedence exception list occurs anywhere in the
 * sentence part before the participle, otherwise returns false.
 */
export default function( sentencePart, participleIndex, cannotBeBetweenAuxiliaryAndParticipleList = [] ) {
	const precedenceExceptionRegex = arrayToRegex( cannotBeBetweenAuxiliaryAndParticipleList );
	const precedenceExceptionMatch = getWordIndices( sentencePart, precedenceExceptionRegex );
	return precedesIndex( precedenceExceptionMatch, participleIndex );
}
