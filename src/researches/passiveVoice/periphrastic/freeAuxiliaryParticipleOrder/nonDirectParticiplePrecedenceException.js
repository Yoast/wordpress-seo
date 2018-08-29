const uniq = require( "lodash/uniq" );

const arrayToRegex = require( "../../../../stringProcessing/createRegexFromArray.js" );
const getWordIndices = require( "../getIndicesWithRegex.js" );
const cannotBeBetweenAuxiliaryAndParticiplePolish =
	require( "../../../polish/functionWords.js" )().cannotBeBetweenPassiveAuxiliaryAndParticiple;
const getIndicesByWordListSorted = require( "../../../../stringProcessing/indices.js" ).getIndicesByWordListSorted;

/**
 * Checks whether there are any exception words in between the auxiliary and participle. If there are, it doesn't return a passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {string} participle The participle in the sentence part.
 * @param {string} auxiliaries One or more auxiliaries in the sentence part.
 * @param {string} language The language of the participle.
 *
 * @returns {boolean} Returns true if a word from the 'cannot be between passive auxiliary and participle' exception list
 * appears anywhere in between the last (closest to participle) auxiliary and the participle.
 */
module.exports = function( sentencePart, participle, auxiliaries, language ) {
	const auxiliariesUnique = uniq( auxiliaries );

	const auxiliaryIndices = getIndicesByWordListSorted( auxiliariesUnique, sentencePart );

	const participleIndex = sentencePart.indexOf( participle );
	let nonDirectParticiplePrecendenceExceptionRegex;

	switch ( language ) {
		case "pl":
			nonDirectParticiplePrecendenceExceptionRegex = arrayToRegex( cannotBeBetweenAuxiliaryAndParticiplePolish );
			break;
	}

	// This exception is only applicable for passive constructions in which the auxiliary precedes the participle.
	const matches = auxiliaryIndices.filter( auxiliaryIndex => auxiliaryIndex.index < participleIndex );

	// If there are no auxiliaries before the participle, this exception is not applicable.
	if( matches.length === 0 ) {
		return false;
	}

	// We pick the auxiliary closest to the participle, since that is most likely the one belonging to the participle.
	const participleAuxiliary = matches[ matches.length - 1 ];

	const precedenceExceptionIndices = getWordIndices( sentencePart, nonDirectParticiplePrecendenceExceptionRegex );

	// Check whether there are any precendence words between the auxiliary and the participle.
	const remaningPrecedenceExceptionIndices = precedenceExceptionIndices.filter( precedenceExceptionIndex =>
		( precedenceExceptionIndex.index > participleAuxiliary.index && precedenceExceptionIndex.index < participleIndex ) );

	return remaningPrecedenceExceptionIndices.length > 0;
};
