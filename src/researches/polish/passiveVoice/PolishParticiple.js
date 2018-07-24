const Participle = require( "../../../values/Participle.js" );
const checkException = require( "../../passiveVoice/periphrastic/checkException.js" );
const directPrecedenceException = require( "../../../stringProcessing/directPrecedenceException" );
const precedenceException = require( "../../../stringProcessing/precedenceException" );

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
	let sentencePart = this.getSentencePart();
	let participleIndex = sentencePart.indexOf( this.getParticiple() );
	let language = this.getLanguage();

	return ! this.directPrecedenceException( sentencePart, participleIndex, language ) &&
		! this.precedenceException( sentencePart, participleIndex, language );
};

PolishParticiple.prototype.directPrecedenceException = directPrecedenceException;

PolishParticiple.prototype.precedenceException = precedenceException;

module.exports = PolishParticiple;
