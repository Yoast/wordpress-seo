import { uniq } from "lodash-es";

import arrayToRegex from "../../../regex/createRegexFromArray.js";
import getWordIndices from "../getIndicesWithRegex.js";

import { getIndicesByWordListSorted } from "../../../word/indices.js";

/**
 * Checks whether there are any exception words in between the auxiliary and participle. If there are, it doesn't return a passive.
 *
 * @param {string} sentencePart 									The sentence part that contains the participle.
 * @param {string} participle 										The participle in the sentence part.
 * @param {string[]} auxiliaries 										One or more auxiliaries in the sentence part.
 * @param {string[]} cannotBeBetweenPassiveAuxiliaryAndParticiple 	The list of words that cannot be between the auxiliary and participle.
 *
 * @returns {boolean} Returns true if a word from the 'cannot be between passive auxiliary and participle' exception list
 * appears anywhere in between the last (closest to participle) auxiliary and the participle.
 */
export default function( sentencePart, participle, auxiliaries, cannotBeBetweenPassiveAuxiliaryAndParticiple ) {
	const auxiliariesUnique = uniq( auxiliaries );

	const auxiliaryIndices = getIndicesByWordListSorted( auxiliariesUnique, sentencePart );

	const participleIndex = sentencePart.indexOf( participle );
	const nonDirectParticiplePrecendenceExceptionRegex = arrayToRegex( cannotBeBetweenPassiveAuxiliaryAndParticiple );

	// This exception is only applicable for passive constructions in which the auxiliary precedes the participle.
	const matches = auxiliaryIndices.filter( auxiliaryIndex => auxiliaryIndex.index < participleIndex );

	// If there are no auxiliaries before the participle, this exception is not applicable.
	if ( matches.length === 0 ) {
		return false;
	}

	// We pick the auxiliary closest to the participle, since that is most likely the one belonging to the participle.
	const participleAuxiliary = matches[ matches.length - 1 ];

	const precedenceExceptionIndices = getWordIndices( sentencePart, nonDirectParticiplePrecendenceExceptionRegex );

	// Check whether there are any precendence words between the auxiliary and the participle.
	const remainingPrecedenceExceptionIndices = precedenceExceptionIndices.filter( precedenceExceptionIndex =>
		( precedenceExceptionIndex.index > participleAuxiliary.index && precedenceExceptionIndex.index < participleIndex ) );

	return remainingPrecedenceExceptionIndices.length > 0;
}
