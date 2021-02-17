import Participle from "../../../../values/Participle.js";

/**
 * Creates a Participle object for the Czech language.
 *
 * @param {string} participle           The participle.
 * @param {string} sentencePart         The sentence part that contains the participle.
 * @param {Object} attributes           The attributes object.
 *
 * @constructor
 */
const CzechParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
};

require( "util" ).inherits( CzechParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
CzechParticiple.prototype.isPassive = function() {
	return true;
};

export default CzechParticiple;

