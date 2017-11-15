var Participle = require( "../../values/Participle.js" );

var exceptionsParticiplesAdjectivesVerbs = require( "./passivevoice/exceptionsParticiples.js" )().adjectivesVerbs;
var exceptionsParticiplesNouns = require( "./passivevoice/exceptionsParticiples.js" )().nouns;
var exceptionsParticiplesOthers = require( "./passivevoice/exceptionsParticiples.js" )().others;


var includes = require( "lodash/includes" );
var isEmpty = require( "lodash/isEmpty" );
var forEach = require( "lodash/forEach" );

/**
 * Creates an Participle object for the French language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {object} attributes  The attributes object.
 *
 * @constructor
 */
var FrenchParticiple = function(  participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	this.checkException();
};

require( "util" ).inherits( FrenchParticiple, Participle );

/**
 * Sets sentence part passiveness to passive if there is no exception.
 *
 * @returns {void}
 */
FrenchParticiple.prototype.checkException = function() {
	if ( isEmpty( this.getParticiple() ) ) {
		this.setSentencePartPassiveness( false );
		return;
	}

	this.setSentencePartPassiveness( this.isPassive() );
};

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
FrenchParticiple.prototype.isPassive = function() {
	return 	! this.isOnParticipleExceptionList();
};

/**
 * Checks whether a found participle is in the exceptionsParticiples list.
 * If a word is in the exceptionsParticiples list, it isn't a participle.
 * Irregular participles do not end in -é, and therefore cannot be in the exceptionsParticiples list.
 *
 * @returns {boolean} Returns true if it is in the exceptionsParticiples list, otherwise returns false.
 */
FrenchParticiple.prototype.isOnParticipleExceptionList = function() {
	if ( this.getType() === "irregular" ) {
		return false;
	}

	var participle = this.getParticiple();
	var matches = [];

	// Check exception words that can get e/s/es as suffix.
	forEach( exceptionsParticiplesAdjectivesVerbs, function( exceptionParticiple ) {
		var exceptionsParticiplesRegex = new RegExp( "^" + exceptionParticiple + "(e|s|es)?$", "ig" );
		matches.push( participle.match( exceptionsParticiplesRegex ) || [] );
	} );
	matches = [].concat.apply( [], matches );
	if( matches.length > 0 ) {
		return true;
	}

	// Check exception words that can get s as suffix.
	forEach( exceptionsParticiplesNouns, function( exceptionParticiple ) {
		var exceptionsParticiplesRegex = new RegExp( "^" + exceptionParticiple + "(s)?$", "ig" );
		matches.push( participle.match( exceptionsParticiplesRegex ) || [] );
	} );
	matches = [].concat.apply( [], matches );
	if( matches.length > 0 ) {
		return true;
	}

	// Check exception words that can't have a suffix.
	if( includes( exceptionsParticiplesOthers, this.getParticiple() ) ) {
		return true;
	}

	return false;
};


module.exports = FrenchParticiple;
