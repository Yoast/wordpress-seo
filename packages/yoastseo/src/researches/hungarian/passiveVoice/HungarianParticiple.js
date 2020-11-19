import Participle from "../../../values/Participle.js";
import checkException from "../../passiveVoice/periphrastic/checkException.js";

/**
 * Creates an Participle object for the Hungarian language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {Object} attributes The attributes object.
 *
 * @constructor
 */
const HungarianParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( HungarianParticiple, Participle );

/**
 * All Hungarian participles are passives.
 *
 * @returns {boolean}       Returns true.
 */
HungarianParticiple.prototype.isPassive = function() {
	return true
};

export default HungarianParticiple;
