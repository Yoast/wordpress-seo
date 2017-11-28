var Participle = require( "../../values/Participle.js" );
var checkException = require( "../passivevoice/checkException.js" );

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
 * @param {object} attributes  The attributes object.
 *
 * @constructor
 */
var FrenchParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( FrenchParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
FrenchParticiple.prototype.isPassive = function() {
	return 	! this.isOnAdjectivesVerbsExceptionList() &&
				! this.isOnNounsExceptionList() &&
				! this.isOnOthersExceptionList();
};

/**
 * Creates regexes to match adjective and verb participle exceptions (including suffixes) and memoizes them.
 *
 * @returns {array} Returns an array with all adjective and verb participle exceptions.
 */
var getExceptionsParticiplesAdjectivesVerbsRegexes = memoize( function() {
	let exceptionsParticiplesAdjectivesVerbsRegexes = [];
	forEach( exceptionsParticiplesAdjectivesVerbs, function( exceptionParticipleAdjectiveVerb ) {
		exceptionsParticiplesAdjectivesVerbsRegexes.push( new RegExp( "^" + exceptionParticipleAdjectiveVerb + "(e|s|es)?$", "ig" ) );
	} );
	return exceptionsParticiplesAdjectivesVerbsRegexes;
} );

/**
 * Creates regexes to match noun participle exceptions (including suffixes) and memoizes them.
 *
 * @returns {array} Returns an array with all noun participle exceptions.
 */
var getExceptionsParticiplesNouns = memoize( function() {
	let exceptionsParticiplesNounsRegexes = [];
	forEach( exceptionsParticiplesNouns, function( exceptionParticipleNoun ) {
		exceptionsParticiplesNounsRegexes.push( new RegExp( "^" + exceptionParticipleNoun + "(s)?$", "ig" ) );
	} );
	return exceptionsParticiplesNounsRegexes;
} );

/**
 * Checks whether the type of the participle is an irregular.
 *
 * @returns {boolean} Returns false if the passive is an irregular.
 */
var checkIrregular = function() {
	if ( this.getType() === "irregular" ) {
		return false;
	}
};

/**
 * Checks whether a found participle is in the exception list of adjectives and verbs.
 * If a word is on the list, it isn't a participle.
 * Irregular participles do not end in -é and therefore can't be on the list.
 *
 * @returns {boolean} Returns true if it is in the exception list of adjectives and verbs, otherwise returns false.
 */
FrenchParticiple.prototype.isOnAdjectivesVerbsExceptionList = function() {
	checkIrregular.call( this );

	var participle = this.getParticiple();
	var matches = [];
	var exceptionParticiplesAdjectivesVerbs = getExceptionsParticiplesAdjectivesVerbsRegexes();

	// Check exception words that can get e/s/es as suffix.
	forEach( exceptionParticiplesAdjectivesVerbs, function( exceptionParticipleAdjectiveVerb ) {
		matches.push( participle.match( exceptionParticipleAdjectiveVerb ) || [] );
	} );
	matches = [].concat.apply( [], matches );
	if( matches.length > 0 ) {
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
	checkIrregular.call( this );

	var participle = this.getParticiple();
	var matches = [];
	var exceptionsParticiplesNouns = getExceptionsParticiplesNouns();

	// Check exception words that can get s as suffix.
	forEach( exceptionsParticiplesNouns, function( exceptionParticipleNoun ) {
		matches.push( participle.match( exceptionParticipleNoun ) || [] );
	} );
	matches = [].concat.apply( [], matches );
	if( matches.length > 0 ) {
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
	checkIrregular.call( this );

	return includes( exceptionsParticiplesOthers, this.getParticiple() );
};

module.exports = FrenchParticiple;
