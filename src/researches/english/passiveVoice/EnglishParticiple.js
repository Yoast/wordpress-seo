var Participle = require( "../../../values/Participle.js" );
var checkException = require( "../../passiveVoice/periphrastic/checkException.js" );

var nonVerbsEndingEd = require( "./non-verb-ending-ed.js" )();
var directPrecedenceException = require( "../../../stringProcessing/directPrecedenceException" );
var precedenceException = require( "../../../stringProcessing/precedenceException" );

import { includes } from "lodash-es";
import { isEmpty } from "lodash-es";
import { intersection } from "lodash-es";

var irregularExclusionArray = [ "get", "gets", "getting", "got", "gotten" ];

/**
 * Creates an Participle object for the English language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes  The attributes object.
 *
 * @constructor
 */
var EnglishParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( EnglishParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
EnglishParticiple.prototype.isPassive = function() {
	let sentencePart = this.getSentencePart();
	let participleIndex = sentencePart.indexOf( this.getParticiple() );
	let language = this.getLanguage();

	return 	! this.isNonVerbEndingEd() &&
		! this.hasRidException() &&
		! this.directPrecedenceException( sentencePart, participleIndex, language ) &&
		! this.precedenceException( sentencePart, participleIndex, language );
};

/**
 * Checks whether a found participle is in the nonVerbsEndingEd list.
 * If a word is in the nonVerbsEndingEd list, it isn't a participle.
 * Irregular participles do not end in -ed, and therefore cannot be in the nonVerbsEndingEd list.
 *
 * @returns {boolean} Returns true if it is in the nonVerbsEndingEd list, otherwise returns false.
 */
EnglishParticiple.prototype.isNonVerbEndingEd = function() {
	if ( this.getType() === "irregular" ) {
		return false;
	}
	return includes( nonVerbsEndingEd, this.getParticiple() );
};

/**
 * Checks whether the participle is 'rid' in combination with 'get', 'gets', 'getting', 'got' or 'gotten'.
 * If this is true, the participle is not passive.
 *
 * @returns {boolean} Returns true if 'rid' is found in combination with a form of 'get'
 * otherwise returns false.
 */
EnglishParticiple.prototype.hasRidException = function() {
	if ( this.getParticiple() === "rid" ) {
		var auxiliaries = this.getAuxiliaries();
		return ! isEmpty( intersection( irregularExclusionArray, auxiliaries ) );
	}
	return false;
};

EnglishParticiple.prototype.directPrecedenceException = directPrecedenceException;

EnglishParticiple.prototype.precedenceException = precedenceException;

module.exports = EnglishParticiple;
