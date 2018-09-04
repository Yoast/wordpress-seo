import { includes } from "lodash-es";

import Participle from '../../../values/Participle.js';
import checkException from '../../passiveVoice/periphrastic/checkException.js';
import nonParticiples from './nonParticiples';
import directPrecedenceException from '../../../stringProcessing/directPrecedenceException';

/**
 * Creates an Participle object for the Dutch language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
const DutchParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( DutchParticiple, Participle );

/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
DutchParticiple.prototype.isPassive = function() {
	const sentencePart = this.getSentencePart();
	const participleIndex = sentencePart.indexOf( this.getParticiple() );
	const language = this.getLanguage();

	return ! this.isOnNonParticiplesList() &&
		! this.hasNonParticipleEnding() &&
		! this.directPrecedenceException( sentencePart, participleIndex, language );
};

/**
 * Checks whether a found participle is in the nonParticiples list.
 *
 * @returns {boolean} Returns true if it is in the nonParticiples list, otherwise returns false.
 */
DutchParticiple.prototype.isOnNonParticiplesList = function() {
	if ( this.getType() === "irregular" ) {
		return false;
	}

	return includes( nonParticiples(), this.getParticiple() );
};

/**
 * Checks whether a found participle has a non-participle ending and is therefore not really a participle.
 *
 * @returns {boolean} Returns true if the participle has a non-participle ending, otherwise returns false.
 */
DutchParticiple.prototype.hasNonParticipleEnding = function() {
	return ( /\S+(heid|teit|tijd)($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ).test( this.getParticiple() );
};

DutchParticiple.prototype.directPrecedenceException = directPrecedenceException;

export default DutchParticiple;
