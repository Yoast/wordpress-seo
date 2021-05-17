import { includes, isEmpty, intersection } from "lodash-es";
import { languageProcessing, values } from "yoastseo";
const {
	checkException,
	directPrecedenceException,
	precedenceException,
} = languageProcessing;
const { Participle } = values;

import nonVerbsEndingEd from "../config/internal/passiveVoiceNonVerbEndingEd.js";
import {
	cannotDirectlyPrecedePassiveParticiple,
	cannotBeBetweenPassiveAuxiliaryAndParticiple,
} from "../config/functionWords.js";

const irregularExclusionArray = [ "get", "gets", "getting", "got", "gotten" ];

/**
 * Creates an Participle object for the English language.
 *
 * @param {string} participle   The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes   The attributes object.
 *
 * @constructor
 */
const EnglishParticiple = function( participle, sentencePart, attributes ) {
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
	const sentencePart = this.getSentencePart();
	const participle = this.getParticiple();

	return 	! this.isNonVerbEndingEd() &&
		! this.hasRidException() &&
		! this.directPrecedenceException( sentencePart, participle, cannotDirectlyPrecedePassiveParticiple ) &&
		! this.precedenceException( sentencePart, participle, cannotBeBetweenPassiveAuxiliaryAndParticiple );
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
		const auxiliaries = this.getAuxiliaries();
		return ! isEmpty( intersection( irregularExclusionArray, auxiliaries ) );
	}
	return false;
};

EnglishParticiple.prototype.directPrecedenceException = directPrecedenceException;

EnglishParticiple.prototype.precedenceException = precedenceException;

export default EnglishParticiple;
