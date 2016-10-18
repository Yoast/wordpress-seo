var getWords = require( "../../../stringProcessing/getWords.js" );

var regexFunction = require( "../../../../js/researches/english/passivevoice-english/participleRegexes.js" )();
var regularParticiples = regexFunction.regularParticiples;
var irregularParticiples = regexFunction.irregularParticiples;

var EnglishParticiple = require( "../EnglishParticiple.js" );

var forEach = require( "lodash/forEach" );

/**
 * Creates EnglishParticiple Objects for the participles found in a sentence part.
 *
 * @param {string} sentencePart The sentence part to finds participles in.
 * @returns {Array} The array with EnglishParticiple Objects.
 */
module.exports = function( sentencePart ) {
	var words = getWords( sentencePart.getSentencePartText() );

	var foundParticiples = [];

	forEach( words, function( word ) {
		if( regularParticiples( word ).length !== 0 ) {
			foundParticiples.push( new EnglishParticiple( word, sentencePart.getSentencePartText(), sentencePart.getAuxiliaries(), "regular" ) );
			return;
		}
		if( irregularParticiples( word ).length !== 0 ) {
			foundParticiples.push( new EnglishParticiple( word, sentencePart.getSentencePartText(), sentencePart.getAuxiliaries(), "irregular" ) );
		}
	} );
	return foundParticiples;
};
