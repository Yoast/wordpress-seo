import getWordIndices from "../passiveVoice/periphrastic/getIndicesWithRegex.js";
import includesIndex from "../word/includesIndex";
import arrayToRegex from "../regex/createRegexFromArray.js";

/**
 * Checks whether the participle is directly preceded by a word from the direct precedence exception list.
 * If this is the case, the sentence part is not passive.
 *
 * @todo seems this one isn't used anywhere...
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {number} participleIndex The index of the participle.
 * @param {Array} cannotDirectlyPrecedePassiveParticipleList array of function words which cannot directly precede a passive participle.
 *
 * @returns {boolean} Returns true if a word from the direct precedence exception list is directly preceding
 * the participle, otherwise returns false.
 */
export default function( sentencePart, participleIndex, cannotDirectlyPrecedePassiveParticipleList = [] ) {
	const directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticipleList );
	const directPrecedenceExceptionMatch = getWordIndices( sentencePart, directPrecedenceExceptionRegex );
	return includesIndex( directPrecedenceExceptionMatch, participleIndex );
}
