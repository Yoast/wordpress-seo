const getWordIndices = require( "../researches/passiveVoice/periphrastic/getIndicesWithRegex.js" );
const precedesIndex = require( "./precedesIndex" );
const arrayToRegex = require( "./createRegexFromArray.js" );
const cannotBeBetweenAuxiliaryAndParticipleFrench =
	require( "../researches/french/functionWords.js" )().cannotBeBetweenPassiveAuxiliaryAndParticiple;
const cannotBeBetweenAuxiliaryAndParticipleEnglish =
	require( "../researches/english/functionWords.js" )().cannotBeBetweenPassiveAuxiliaryAndParticiple;
const cannotBeBetweenAuxiliaryAndParticipleSpanish =
	require( "../researches/spanish/functionWords.js" )().cannotBeBetweenPassiveAuxiliaryAndParticiple;
const cannotBeBetweenAuxiliaryAndParticipleItalian =
	require( "../researches/italian/functionWords.js" )().cannotBeBetweenPassiveAuxiliaryAndParticiple;
const cannotBeBetweenAuxiliaryAndParticiplePolish =
	require( "../researches/polish/functionWords.js" )().cannotBeBetweenPassiveAuxiliaryAndParticiple;

/**
 * Checks whether a word from the precedence exception list occurs anywhere in the sentence part before the participle.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {number} participleIndex The index of the participle.
 * @param {string} language The language of the participle.
 *
 * @returns {boolean} Returns true if a word from the precedence exception list occurs anywhere in the
 * sentence part before the participle, otherwise returns false.
 */
module.exports = function( sentencePart, participleIndex, language ) {
	let precedenceExceptionRegex;
	switch ( language ) {
		case "fr":
			precedenceExceptionRegex = arrayToRegex( cannotBeBetweenAuxiliaryAndParticipleFrench );
			break;
		case "es":
			precedenceExceptionRegex = arrayToRegex( cannotBeBetweenAuxiliaryAndParticipleSpanish );
			break;
		case "it":
			precedenceExceptionRegex = arrayToRegex( cannotBeBetweenAuxiliaryAndParticipleItalian );
			break;
		case "pl":
			precedenceExceptionRegex = arrayToRegex( cannotBeBetweenAuxiliaryAndParticiplePolish );
			break;
		case "en":
		default:
			precedenceExceptionRegex = arrayToRegex( cannotBeBetweenAuxiliaryAndParticipleEnglish );
			break;
	}

	const precedenceExceptionMatch = getWordIndices( sentencePart, precedenceExceptionRegex );
	return precedesIndex( precedenceExceptionMatch, participleIndex );
};
