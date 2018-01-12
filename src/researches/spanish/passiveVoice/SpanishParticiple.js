var Participle = require( "../../../values/Participle.js" );
var checkException = require( "../../passiveVoice/checkException.js" );
var directPrecedenceException = require( "../../../stringProcessing/directPrecedenceException" );

/**
 * Creates an Participle object for the Spanish language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes  The attributes object.
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
	let sentencePart = this.getSentencePart();
	let participleIndex = sentencePart.indexOf( this.getParticiple() );

	return ! this.directPrecedenceException( sentencePart, participleIndex );
};

SpanishParticiple.prototype.directPrecedenceException = directPrecedenceException;

module.exports = SpanishParticiple;
