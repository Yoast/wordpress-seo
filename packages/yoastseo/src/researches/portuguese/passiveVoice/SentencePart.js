import SentencePart from "../../../values/SentencePart.js";
import getParticiples from "../../passiveVoice/periphrastic/getParticiples.js";

/**
 * Creates a Portuguese-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
var PortugueseSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries, "pt_PT" );
};

require( "util" ).inherits( PortugueseSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
PortugueseSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries(), "pt" );
};

export default PortugueseSentencePart;
