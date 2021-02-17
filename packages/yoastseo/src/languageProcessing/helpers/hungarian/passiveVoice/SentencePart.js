import SentencePart from "../../../values/SentencePart.js";
import getParticiples from "./getParticiples.js";

/**
 * Creates a Hungarian specific sentence part.
 *
 * @param {string} sentencePartText     The text from the sentence part.
 * @param {Array} auxiliaries           The list of auxiliaries from the sentence part.
 * @param {string} locale               The locale used for this sentence part.
 *
 * @constructor
 */
const HungarianSentencePart = function( sentencePartText, auxiliaries, locale ) {
	SentencePart.call( this, sentencePartText, auxiliaries, locale );
};

require( "util" ).inherits( HungarianSentencePart, SentencePart );

/**
 * Returns the participle objects for the participles found in the sentence part.
 *
 * @returns {Array}                              The list of participle objects.
 */

HungarianSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries(), "hu" );
};

export default HungarianSentencePart;
