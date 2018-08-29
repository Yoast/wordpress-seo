const getWordIndices = require( "../researches/passiveVoice/periphrastic/getIndicesWithRegex.js" );
const includesIndex = require( "./includesIndex" );
const arrayToRegex = require( "./createRegexFromArray.js" );
const cannotDirectlyPrecedePassiveParticipleFrench = require( "../researches/french/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;
const cannotDirectlyPrecedePassiveParticipleEnglish = require( "../researches/english/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;
const cannotDirectlyPrecedePassiveParticipleSpanish = require( "../researches/spanish/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;
const cannotDirectlyPrecedePassiveParticipleItalian = require( "../researches/italian/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;
const cannotDirectlyPrecedePassiveParticipleDutch = require( "../researches/dutch/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;
const cannotDirectlyPrecedePassiveParticiplePolish = require( "../researches/polish/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;


/**
 * Checks whether the participle is directly preceded by a word from the direct precedence exception list.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {number} participleIndex The index of the participle.
 * @param {string} language The language of the participle.
 *
 * @returns {boolean} Returns true if a word from the direct precedence exception list is directly preceding
 * the participle, otherwise returns false.
 */
module.exports = function( sentencePart, participleIndex, language ) {
	let directPrecedenceExceptionRegex;
	switch ( language ) {
		case "fr":
			directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticipleFrench );
			break;
		case "es":
			directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticipleSpanish );
			break;
		case "it":
			directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticipleItalian );
			break;
		case "nl":
			directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticipleDutch );
			break;
		case "pl":
			directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticiplePolish );
			break;
		case "en":
		default:
			directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticipleEnglish );
			break;
	}
	const directPrecedenceExceptionMatch = getWordIndices( sentencePart, directPrecedenceExceptionRegex );
	return includesIndex( directPrecedenceExceptionMatch, participleIndex );
};
