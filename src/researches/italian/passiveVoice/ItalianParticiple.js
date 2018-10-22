import Participle from "../../../values/Participle.js";
import checkException from "../../passiveVoice/periphrastic/checkException.js";
import directPrecedenceException from "../../../stringProcessing/directPrecedenceException";
import precedenceException from "../../../stringProcessing/precedenceException";


/**
 * Creates an Participle object for the Italian language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
var ItalianParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( ItalianParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
ItalianParticiple.prototype.isPassive = function() {
	const sentencePart = this.getSentencePart();
	const participleIndex = sentencePart.indexOf( this.getParticiple() );
	const language = this.getLanguage();

	return ! this.directPrecedenceException( sentencePart, participleIndex, language ) &&
		! this.precedenceException( sentencePart, participleIndex, language );
};

ItalianParticiple.prototype.directPrecedenceException = directPrecedenceException;

ItalianParticiple.prototype.precedenceException = precedenceException;

export default ItalianParticiple;
