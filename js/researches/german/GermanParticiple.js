var Participle = require( "../../values/Participle.js" );

var getIndices = require( "../../stringProcessing/indices.js" ).getIndices;
var getIndicesOfList = require( "../../stringProcessing/indices.js" ).getIndicesOfList;
var exceptionsRegex =
	/\S+(apparat|arbeit|dienst|haft|halt|keit|kraft|not|pflicht|schaft|schrift|tät|wert|zeit)($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var exceptionsParticiplesActive = require( "./passivevoice-german/exceptionsParticiplesActive.js" )();

var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );
var map = require( "lodash/map" );

var GermanParticiple = function(  participle, sentencePart, auxiliary, type ) {
	Participle.call( this, participle, sentencePart, auxiliary, type );
	this.isException();
};

require( "util" ).inherits( GermanParticiple, Participle );

GermanParticiple.prototype.isException = function() {
	var isPassive = ! this.hasNounSuffix() && ! this.isInExceptionList() && ! this.hasHabenSeinException();
	this.setSentencePartPassiveness( isPassive );
};

/**
 * Checks whether a found participle is in the exception list.
 * If a word is in the exceptionsParticiplesActive list, it isn't a participle.
 *
 * @returns {boolean} Returns true if it is in the exception list, otherwise returns false.
 */
GermanParticiple.prototype.isInExceptionList = function() {
	var participle = this.getParticiple();
	return includes( exceptionsParticiplesActive, participle );
};

/**
 * Checks whether a found participle ends in a noun suffix.
 * If a word ends in a noun suffix from the exceptionsRegex, it isn't a participle.
 *
 * @returns {boolean} Returns true if it ends in a noun suffix, otherwise returns false.
 */
GermanParticiple.prototype.hasNounSuffix = function() {
	var participle = this.getParticiple();
	return participle.match( exceptionsRegex ) !== null;
};

/**
 * Checks whether a participle is followed by 'haben' or 'sein'.
 * If a participle is followed by one of these, the sentence is not passive.
 *
 * @returns {boolean} Returns true if it is an exception, otherwise returns false.
 */
GermanParticiple.prototype.hasHabenSeinException = function() {
	var participleIndices = getIndices( this.getParticiple(), this.getSentencePart() );
	var habenSeinIndices = getIndicesOfList( [ "haben", "sein" ], this.getSentencePart() );
	var isPassiveException = false;
	if( participleIndices.length > 0 ) {
		if ( habenSeinIndices.length === 0 ) {
			return isPassiveException;
		}
		habenSeinIndices = map( habenSeinIndices, "index" );
		forEach( participleIndices, function( participleIndex ) {
			isPassiveException = includes( habenSeinIndices, participleIndex.index + participleIndex.match.length + 1 );
		} );
	}
	return isPassiveException;
};

module.exports = GermanParticiple;
