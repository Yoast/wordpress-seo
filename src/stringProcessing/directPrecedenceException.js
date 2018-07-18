var getWordIndices = require( "../researches/passiveVoice/periphrastic/getIndicesWithRegex.js" );
var includesIndex = require( "./includesIndex" );
var arrayToRegex = require( "./createRegexFromArray.js" );
var cannotDirectlyPrecedePassiveParticipleFrench = require( "../researches/french/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;
var cannotDirectlyPrecedePassiveParticipleEnglish = require( "../researches/english/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;
var cannotDirectlyPrecedePassiveParticipleSpanish = require( "../researches/spanish/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;
var cannotDirectlyPrecedePassiveParticipleItalian = require( "../researches/italian/functionWords.js" )().cannotDirectlyPrecedePassiveParticiple;

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
	var directPrecedenceExceptionRegex;
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
		case "en":
		default:
			directPrecedenceExceptionRegex = arrayToRegex( cannotDirectlyPrecedePassiveParticipleEnglish );
			break;
	}
	var directPrecedenceExceptionMatch = getWordIndices( sentencePart, directPrecedenceExceptionRegex );
	return includesIndex( directPrecedenceExceptionMatch, participleIndex );
};
