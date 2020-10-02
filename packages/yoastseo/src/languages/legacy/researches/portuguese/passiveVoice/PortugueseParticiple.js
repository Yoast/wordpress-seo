import Participle from "../../../../../values/Participle.js";
import checkException from "../../passiveVoice/periphrastic/checkException.js";
import directPrecedenceException from "../../../stringProcessing/directPrecedenceExceptionWithoutRegex";
import precedenceException from "../../../stringProcessing/precedenceExceptionWithoutRegex";


/**
 * Creates an Participle object for the Portuguese language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
const PortugueseParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( PortugueseParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
PortugueseParticiple.prototype.isPassive = function() {
	const sentencePart = this.getSentencePart();
	const participle = this.getParticiple();
	const language = this.getLanguage();

	return ! this.directPrecedenceException( sentencePart, participle, language ) &&
		! this.precedenceException( sentencePart, participle, language );
};

PortugueseParticiple.prototype.directPrecedenceException = directPrecedenceException;

PortugueseParticiple.prototype.precedenceException = precedenceException;

export default PortugueseParticiple;
