import SentencePart from "../../../../values/SentencePart.js";
import getParticiples from "../helpers/internal/getParticiples.js";

/**
 * Creates a Hungarian specific sentence part.
 *
 * @param {string} sentencePartText     The text from the sentence part.
 * @param {Array} auxiliaries           The list of auxiliaries from the sentence part.
 *
 * @constructor
 */
const HungarianSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries );
};

require( "util" ).inherits( HungarianSentencePart, SentencePart );

/**
 * Returns the participle objects for the participles found in the sentence part.
 *
 * @returns {Array}                              The list of participle objects.
 */

HungarianSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries() );
};

export default HungarianSentencePart;
