import SentencePart from "../../../values/SentencePart.js";
import getParticiples from "../../passiveVoice/periphrastic/getParticiples.js";

/**
 * Creates an Italian-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
var ItalianSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries, "it_IT" );
};

require( "util" ).inherits( ItalianSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
ItalianSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries(), "it" );
};

export default ItalianSentencePart;
