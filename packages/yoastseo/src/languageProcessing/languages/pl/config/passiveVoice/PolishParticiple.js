import Participle from "../../../../../values/Participle.js";
import checkException from "../../../../helpers/passiveVoice/periphrastic/checkException.js";
import nonDirectPrecedenceException from "../../../../helpers/passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/nonDirectParticiplePrecedenceException";
import directPrecedenceException from "../../../../helpers/passiveVoice/directPrecedenceException";
import { getFunctionWords } from "../functionWords.js";
const {
	cannotDirectlyPrecedePassiveParticiple: cannotDirectlyPrecedePassiveParticipleList,
} = getFunctionWords();

/**
 * Creates an Participle object for the Polish language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
const PolishParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( PolishParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
PolishParticiple.prototype.isPassive = function() {
	const sentencePart = this.getSentencePart();
	const participle = this.getParticiple();
	const auxiliaries = this.getAuxiliaries();
	const language = this.getLanguage();

	return ! this.directPrecedenceException( sentencePart, participle, cannotDirectlyPrecedePassiveParticipleList ) &&
		! this.nonDirectPrecedenceException( sentencePart, participle, auxiliaries, language );
};

PolishParticiple.prototype.directPrecedenceException = directPrecedenceException;

PolishParticiple.prototype.nonDirectPrecedenceException = nonDirectPrecedenceException;

export default PolishParticiple;
