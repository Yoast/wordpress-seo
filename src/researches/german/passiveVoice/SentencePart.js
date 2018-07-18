var SentencePart = require( "../../../values/SentencePart.js" );

var getParticiples = require( "./getParticiples.js" );

/**
 * Creates a German-specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
var GermanSentencePart = function( sentencePartText, auxiliaries ) {
	SentencePart.call( this, sentencePartText, auxiliaries, "de_DE" );
};

require( "util" ).inherits( GermanSentencePart, SentencePart );

/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
GermanSentencePart.prototype.getParticiples = function() {
	return getParticiples( this.getSentencePartText(), this.getAuxiliaries() );
};

module.exports = GermanSentencePart;
