import SentencePart from "../../../../values/SentencePart.js";
import getParticiples from "../helpers/internal/getParticiples.js";

/**
 * Creates a French-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 *
 * @constructor
 */
const FrenchSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries );
};

require( "util" ).inherits( FrenchSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
FrenchSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries() );
};

export default FrenchSentencePart;
