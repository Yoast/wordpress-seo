import SentencePart from "../../../values/SentencePart.js";
import getParticiples from "../../passiveVoice/periphrastic/getParticiples.js";

/**
 * Creates a Polish-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
const PolishSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries, "pl_PL" );
};

require( "util" ).inherits( PolishSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
PolishSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries(), "pl" );
};

export default PolishSentencePart;
