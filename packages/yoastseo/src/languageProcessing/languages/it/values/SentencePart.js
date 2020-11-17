import SentencePart from "../../../../values/SentencePart.js";
import getParticiples from "../helpers/internal/getParticiples.js";

/**
 * Creates an Italian-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
const ItalianSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries );
};

require( "util" ).inherits( ItalianSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
ItalianSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries() );
};

export default ItalianSentencePart;
