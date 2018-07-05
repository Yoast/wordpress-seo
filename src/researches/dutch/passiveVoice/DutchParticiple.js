const Participle = require( "../../../values/Participle.js" );
const checkException = require( "../../passiveVoice/periphrastic/checkException.js" );
const nonParticiples = require( "./nonParticiples" );
const includes = require ( "lodash/includes" );

// var directPrecedenceException = require( "../../../stringProcessing/directPrecedenceException" );
// var precedenceException = require( "../../../stringProcessing/precedenceException" );


/**
 * Creates an Participle object for the Dutch language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
var DutchParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( DutchParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
DutchParticiple.prototype.isPassive = function() {
	let sentencePart = this.getSentencePart();
	// let participleIndex = sentencePart.indexOf( this.getParticiple() );
	// let language = this.getLanguage();

	return ! this.isOnNonParticiplesList();
	// return ! this.directPrecedenceException( sentencePart, participleIndex, language ) &&
	// 	! this.precedenceException( sentencePart, participleIndex, language );
};

/**
 * Checks whether a found participle is in the nonParticiples list.
 *
 * @returns {boolean} Returns true if it is in the nonParticiples list, otherwise returns false.
 */
DutchParticiple.prototype.isOnNonParticiplesList = function() {
	if ( this.getType() === "irregular" ) {
		return false;
	}

	return includes( nonParticiples(), this.getParticiple() );
};

// DutchParticiple.prototype.directPrecedenceException = directPrecedenceException;
//
// DutchParticiple.prototype.precedenceException = precedenceException;

module.exports = DutchParticiple;
