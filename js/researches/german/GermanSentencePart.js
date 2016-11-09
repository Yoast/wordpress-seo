var SentencePart = require( "../../values/SentencePart.js" );

var getParticiples = require( "./passivevoice-german/getParticiples.js" );

/**
 * Creates a German specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @constructor
 */
var GermanSentencePart = function( sentencePartText ) {
	SentencePart.call( this, sentencePartText );
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
