import Participle from "../../../values/Participle.js";
import checkException from "../../passiveVoice/periphrastic/checkException.js";
import nonPassivesInVaAndVe from "./nonPassivesInVaAndVe.js";

/**
 * Creates a Participle object for the Hungarian language.
 *
 * @param {string} participle           The participle.
 * @param {string} sentencePart         The sentence part that contains the participle.
 * @param {Object} attributes           The attributes object.
 *
 * @constructor
 */
const HungarianParticiple = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	checkException.call( this );
};

require( "util" ).inherits( HungarianParticiple, Participle );

/**
 * Checks whether a found participle is in the nonPassivesInVaAndVe list.
 * If a word is in the nonPassivesInVaAndVe list, it isn't a participle.
 *
 * @returns {boolean} Returns true if it is in the nonVerbsEndingEd list, otherwise returns false.
 */
HungarianParticiple.prototype.isNonPassivesInVaAndVe = function() {
	return nonPassivesInVaAndVe.includes( this.getParticiple() );
};

/**
 * Returns Hungarian participles used as passives unless they are on an exception list.
 *
 * @returns {boolean}       Returns true unless the participles are on an exception list.
 */
HungarianParticiple.prototype.isPassive = function() {
	return ! this.isNonPassivesInVaAndVe();
};

export default HungarianParticiple;
