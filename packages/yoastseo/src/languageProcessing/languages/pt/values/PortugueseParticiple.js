import { languageProcessing, values } from "yoastseo";
const {
	checkException,
	directPrecedenceException,
	precedenceException,
} = languageProcessing;
const { Participle } = values;

import { cannotDirectlyPrecedePassiveParticiple } from "../config/functionWords";
/**
 * Creates an Participle object for the Portuguese language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
const PortugueseParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( PortugueseParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
PortugueseParticiple.prototype.isPassive = function() {
	const sentencePart = this.getSentencePart();
	const participle = this.getParticiple();

	return ! this.directPrecedenceException( sentencePart, participle, cannotDirectlyPrecedePassiveParticiple ) &&
		! this.precedenceException( sentencePart, participle, [] );
};

PortugueseParticiple.prototype.directPrecedenceException = directPrecedenceException;

PortugueseParticiple.prototype.precedenceException = precedenceException;

export default PortugueseParticiple;
