import getWordIndices from "../researches/passiveVoice/getIndicesWithRegex.js";
import includesIndex from "./includesIndex";
import arrayToRegex from "./createRegexFromArray.js";

import cannotDirectlyPrecedePassiveParticiple from "../config/passiveVoice/functionWords.js";
const cannotDirectlyPrecedePassiveParticiple = cannotDirectlyPrecedePassiveParticiple().cannotDirectlyPrecedePassiveParticiple;

/**
 * Checks whether the participle is directly preceded by a word from the direct precedence exception list.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {number} participleIndex The index of the participle.
 *
 * @returns {boolean} Returns true if a word from the direct precedence exception list is directly preceding
 * the participle, otherwise returns false.
 */
export default function( sentencePart, participleIndex) {
	let directPrecedenceExceptionRegex;
	directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticiple );

	const directPrecedenceExceptionMatch = getWordIndices( sentencePart, directPrecedenceExceptionRegex );
	return includesIndex( directPrecedenceExceptionMatch, participleIndex );
}
