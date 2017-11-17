var Participle = require( "../../values/Participle.js" );

var exceptionsParticiplesAdjectivesVerbs = require( "./passivevoice/exceptionsParticiples.js" )().adjectivesVerbs;
var exceptionsParticiplesNouns = require( "./passivevoice/exceptionsParticiples.js" )().nouns;
var exceptionsParticiplesOthers = require( "./passivevoice/exceptionsParticiples.js" )().others;


var includes = require( "lodash/includes" );
var isEmpty = require( "lodash/isEmpty" );
var forEach = require( "lodash/forEach" );
var memoize = require ( "lodash/memoize" );

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
 * Creates regexes to match adjective and verb participle exceptions and memoizes them.
 *
 * @returns {array} Returns an array with all adjective and verb participle exceptions.
 */
var getExceptionsParticiplesAdjectivesVerbsRegexes = memoize( function() {
let exceptionsParticiplesAdjectivesVerbsRegexes = [];
forEach( exceptionsParticiplesAdjectivesVerbs, function( exceptionParticipleAdjectiveVerb )
	{
		exceptionsParticiplesAdjectivesVerbsRegexes.push(new RegExp("^" + exceptionParticipleAdjectiveVerb + "(e|s|es)?$", "ig" ));
	} );
	return exceptionsParticiplesAdjectivesVerbsRegexes;
} );

/**
 * Creates regexes to match noun participle exceptions and memoizes them.
 *
 * @returns {array} Returns an array with all noun participle exceptions.
 */
var getExceptionsParticiplesNouns = memoize( function() {
	let exceptionsParticiplesNounsRegexes = [];
	forEach( exceptionsParticiplesNouns, function( exceptionParticipleNoun ) {
		exceptionsParticiplesNounsRegexes.push( new RegExp( "^" + exceptionParticipleNoun + "(s)?$", "ig" ));
	} );
	return exceptionsParticiplesNounsRegexes;
} );

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
	var exceptionParticiplesAdjectivesVerbs = getExceptionsParticiplesAdjectivesVerbsRegexes();
	var exceptionsParticiplesNouns = getExceptionsParticiplesNouns();

	// Check exception words that can get e/s/es as suffix.
	forEach( exceptionParticiplesAdjectivesVerbs, function( exceptionParticipleAdjectiveVerb ) {
	matches.push( participle.match(exceptionParticipleAdjectiveVerb ) || [] );
	} );
	matches = [].concat.apply( [], matches );
	if( matches.length > 0 ) {
		return true;
	}

	// Check exception words that can get s as suffix.
	forEach( exceptionsParticiplesNouns, function( exceptionParticipleNoun ) {
				matches.push( participle.match( exceptionParticipleNoun ) || [] );
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
