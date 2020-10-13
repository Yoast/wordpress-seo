import Participle from "../../../../../values/Participle.js";
import checkException from "../../../../helpers/passiveVoice/periphrastic/checkException.js";
import directPrecedenceException from "../../../../helpers/passiveVoice/directPrecedenceExceptionWithoutRegex";
import precedenceException from "../../../../helpers/passiveVoice/precedenceExceptionWithoutRegex";
import { getFunctionWords } from "../functionWords.js";
const {
	cannotDirectlyPrecedePassiveParticiple: cannotDirectlyPrecedePassiveParticipleList,
	cannotBeBetweenPassiveAuxiliaryAndParticiple: cannotBeBetweenPassiveAuxiliaryAndParticipleList,
} = getFunctionWords();

/**
 * Creates an Participle object for the Spanish language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
var SpanishParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( SpanishParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
SpanishParticiple.prototype.isPassive = function() {
	const sentencePart = this.getSentencePart();
	const participle = this.getParticiple();

	return ! this.directPrecedenceException( sentencePart, participle, cannotDirectlyPrecedePassiveParticipleList ) &&
		! this.precedenceException( sentencePart, participle, cannotBeBetweenPassiveAuxiliaryAndParticipleList );
};

SpanishParticiple.prototype.directPrecedenceException = directPrecedenceException;

SpanishParticiple.prototype.precedenceException = precedenceException;

export default SpanishParticiple;
