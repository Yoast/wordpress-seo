import { languageProcessing, values } from "yoastseo";
const {
	checkException,
	directPrecedenceException,
	nonDirectPrecedenceException,
} = languageProcessing;
const { Participle } = values;

import {
	cannotDirectlyPrecedePassiveParticiple,
	cannotBeBetweenPassiveAuxiliaryAndParticiple,
} from "../config/functionWords.js";

/**
 * Creates an Participle object for the Polish language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
const PolishParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( PolishParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
PolishParticiple.prototype.isPassive = function() {
	const sentencePart = this.getSentencePart();
	const participle = this.getParticiple();
	const auxiliaries = this.getAuxiliaries();

	return ! this.directPrecedenceException( sentencePart, participle, cannotDirectlyPrecedePassiveParticiple ) &&
		! this.nonDirectPrecedenceException( sentencePart, participle, auxiliaries, cannotBeBetweenPassiveAuxiliaryAndParticiple );
};

PolishParticiple.prototype.directPrecedenceException = directPrecedenceException;

PolishParticiple.prototype.nonDirectPrecedenceException = nonDirectPrecedenceException;

export default PolishParticiple;
