var Participle = require( "../../values/Participle.js" );
var checkException = require( "../passivevoice/checkException.js" );
var directPrecedenceException = require( "../../stringProcessing/directPrecedenceException" );
var precedenceException = require( "../../stringProcessing/precedenceException" );

var exceptionsParticiplesAdjectivesVerbs = require( "./passivevoice/exceptionsParticiples.js" )().adjectivesVerbs;
var exceptionsParticiplesNouns = require( "./passivevoice/exceptionsParticiples.js" )().nouns;
var exceptionsParticiplesOthers = require( "./passivevoice/exceptionsParticiples.js" )().others;

var includes = require( "lodash/includes" );
var forEach = require( "lodash/forEach" );
var memoize = require( "lodash/memoize" );

/**
 * Creates an Participle object for the French language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes  The attributes object.
 *
 * @constructor
 */
var FrenchParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( FrenchParticiple, Participle );

/**
 * Checks whether the participle is irregular.
 *
 * @returns {boolean} Returns true if the passive is irregular.
 */
var checkIrregular = function() {
	if ( this.getType() === "irregular" ) {
		return true;
	}
};

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
FrenchParticiple.prototype.isPassive = function() {
	let sentencePart = this.getSentencePart();
	let participleIndex = sentencePart.indexOf( this.getParticiple() );

	// Only check precedence exceptions for irregular participles.
	if ( checkIrregular.call( this ) ) {
		return ! this.directPrecedenceException( sentencePart, participleIndex ) &&
			! this.precedenceException( sentencePart, participleIndex );
	}
	// Check precedence exceptions and exception lists for regular participles.
	return ! this.isOnAdjectivesVerbsExceptionList() &&
		! this.isOnNounsExceptionList() &&
		! this.isOnOthersExceptionList() &&
		! this.directPrecedenceException( sentencePart, participleIndex ) &&
		! this.precedenceException( sentencePart, participleIndex );
};

/**
 * Creates regexes to match adjective and verb participle exceptions (including suffixes) and memoizes them.
 *
 * @returns {Array} Returns an array with all adjective and verb participle exceptions.
 */
var getExceptionsParticiplesAdjectivesVerbsRegexes = memoize( function() {
	let exceptionsParticiplesAdjectivesVerbsRegexes = [];
	forEach( exceptionsParticiplesAdjectivesVerbs, function( exceptionParticiplesAdjectivesVerbs ) {
		exceptionsParticiplesAdjectivesVerbsRegexes.push( new RegExp( "^" + exceptionParticiplesAdjectivesVerbs + "(e|s|es)?$", "ig" ) );
	} );
	return exceptionsParticiplesAdjectivesVerbsRegexes;
} );

/**
 * Creates regexes to match noun participle exceptions (including suffixes) and memoizes them.
 *
 * @returns {Array} Returns an array with all noun participle exceptions.
 */
var getExceptionsParticiplesNounsRegexes = memoize( function() {
	let exceptionsParticiplesNounsRegexes = [];
	forEach( exceptionsParticiplesNouns, function( exceptionParticipleNoun ) {
		exceptionsParticiplesNounsRegexes.push( new RegExp( "^(l'|d')?" + exceptionParticipleNoun + "(s)?$", "ig" ) );
	} );
	return exceptionsParticiplesNounsRegexes;
} );

/**
 * Checks whether a found participle is in the exception list of adjectives and verbs.
 * If a word is on the list, it isn't a participle.
 * Irregular participles do not end in -é and therefore can't be on the list.
 *
 * @returns {boolean} Returns true if it is in the exception list of adjectives and verbs, otherwise returns false.
 */
FrenchParticiple.prototype.isOnAdjectivesVerbsExceptionList = function() {
	var participle = this.getParticiple();
	var match = [];
	var exceptionParticiplesAdjectivesVerbs = getExceptionsParticiplesAdjectivesVerbsRegexes();

	// Check exception words that can get e/s/es as suffix.
	forEach( exceptionParticiplesAdjectivesVerbs, function( exceptionParticipleAdjectiveVerb ) {
		var exceptionMatch = participle.match( exceptionParticipleAdjectiveVerb );
		if ( exceptionMatch ) {
			match.push( exceptionMatch[ 0 ] );
		}
	} );

	if( match.length > 0 ) {
		return true;
	}

	return false;
};

/**
 * Checks whether a found participle is in the exception list of nouns.
 * If a word is on the list, it isn't a participle.
 * Irregular participles do not end in -é and therefore can't be on the list.
 *
 * @returns {boolean} Returns true if it is in the exception list of nouns, otherwise returns false.
 */
FrenchParticiple.prototype.isOnNounsExceptionList = function() {
	var participle = this.getParticiple();
	var match = [];
	var exceptionsParticiplesNouns = getExceptionsParticiplesNounsRegexes();

	// Check exception words that can get s as suffix.
	forEach( exceptionsParticiplesNouns, function( exceptionParticipleNoun ) {
		var exceptionMatch = participle.match( exceptionParticipleNoun );
		if ( exceptionMatch ) {
			match.push( exceptionMatch[ 0 ] );
		}
	} );

	if( match.length > 0 ) {
		return true;
	}

	return false;
};

/**
 * Checks whether a found participle is in the exception list in the 'other' category.
 * If a word is on the list, it isn't a participle.
 * Irregular participles do not end in -é and therefore can't be on the list.
 *
 * @returns {boolean} Returns true if it is in the exception list of nouns, otherwise returns false.
 */
FrenchParticiple.prototype.isOnOthersExceptionList = function() {

	return includes( exceptionsParticiplesOthers, this.getParticiple() );
};

FrenchParticiple.prototype.directPrecedenceException = directPrecedenceException;

FrenchParticiple.prototype.precedenceException = precedenceException;

module.exports = FrenchParticiple;
