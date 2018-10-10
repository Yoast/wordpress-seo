import Participle from "../../../values/Participle.js";
import checkException from "../../passiveVoice/periphrastic/checkException.js";
import directPrecedenceException from "../../../stringProcessing/directPrecedenceException";
import precedenceException from "../../../stringProcessing/precedenceException";


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
	const participleIndex = sentencePart.indexOf( this.getParticiple() );
	const language = this.getLanguage();

	return ! this.directPrecedenceException( sentencePart, participleIndex, language ) &&
		! this.precedenceException( sentencePart, participleIndex, language );
};

SpanishParticiple.prototype.directPrecedenceException = directPrecedenceException;

SpanishParticiple.prototype.precedenceException = precedenceException;

export default SpanishParticiple;
