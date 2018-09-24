import SentencePart from "../../../values/SentencePart.js";
import getParticiples from "../../passiveVoice/periphrastic/getParticiples.js";

/**
 * Creates a English specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @param {string} locale The locale used for this sentence part.
 * @constructor
 */
var EnglishSentencePart = function( sentencePartText, auxiliaries, locale ) {
	SentencePart.call( this, sentencePartText, auxiliaries, locale );
};

require( "util" ).inherits( EnglishSentencePart, SentencePart );

/**
 * Returns the participle objects for the participles found in the sentence part.
 * @returns {Array} The list of participle objects.
 */

EnglishSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries(), "en" );
};

export default EnglishSentencePart;
