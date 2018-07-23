var SentencePart = require( "../../../values/SentencePart.js" );

var getParticiples = require( "../../passiveVoice/periphrastic/getParticiples.js" );

/**
 * Creates a Polish-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
var PolishSentencePart = function( sentencePartText, auxiliaries ) {
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

module.exports = PolishSentencePart;
