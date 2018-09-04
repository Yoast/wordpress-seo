import SentencePart from '../../../values/SentencePart.js';
import getParticiples from '../../passiveVoice/periphrastic/getParticiples.js';

/**
 * Creates a French-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
var FrenchSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries, "fr_FR" );
};

require( "util" ).inherits( FrenchSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
FrenchSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries(), "fr" );
};

export default FrenchSentencePart;
