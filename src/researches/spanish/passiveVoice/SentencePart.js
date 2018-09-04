import SentencePart from '../../../values/SentencePart.js';
import getParticiples from '../../passiveVoice/periphrastic/getParticiples.js';

/**
 * Creates a Spanish-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
var SpanishSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries, "es_ES" );
};

require( "util" ).inherits( SpanishSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
SpanishSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries(), "es" );
};

export default SpanishSentencePart;
