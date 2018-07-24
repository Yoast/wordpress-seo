var SentencePart = require( "../../../values/SentencePart.js" );

var getParticiples = require( "../../passiveVoice/periphrastic/getParticiples.js" );

/**
 * Creates a Dutch-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
var DutchSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries, "nl_NL" );
};

require( "util" ).inherits( DutchSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
DutchSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries(), "nl" );
};

module.exports = DutchSentencePart;
