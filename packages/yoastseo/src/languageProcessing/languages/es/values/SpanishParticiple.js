import { languageProcessing, values } from "yoastseo";
const {
	checkException,
	directPrecedenceException,
	precedenceException,
} = languageProcessing;
const { Participle } = values;

import {
	cannotDirectlyPrecedePassiveParticiple,
	cannotBeBetweenPassiveAuxiliaryAndParticiple,
} from "../config/functionWords.js";

/**
 * Creates an Participle object for the Spanish language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
const SpanishParticiple = function( participle, sentencePart, attributes ) {
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
	const sentencePart = this.getSentencePart();
	const participle = this.getParticiple();

	return ! this.directPrecedenceException( sentencePart, participle, cannotDirectlyPrecedePassiveParticiple ) &&
		! this.precedenceException( sentencePart, participle, cannotBeBetweenPassiveAuxiliaryAndParticiple );
};

SpanishParticiple.prototype.directPrecedenceException = directPrecedenceException;

SpanishParticiple.prototype.precedenceException = precedenceException;

export default SpanishParticiple;
