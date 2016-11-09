var getWords = require( "../../../stringProcessing/getWords.js" );

var regexFunction = require( "../../../../js/researches/english/passivevoice-english/matchParticiples" )();
var regularParticiples = regexFunction.regularParticiples;
var irregularParticiples = regexFunction.irregularParticiples;

var EnglishParticiple = require( "../EnglishParticiple.js" );

var forEach = require( "lodash/forEach" );

/**
 * Creates English participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePart The sentence part to find participles in.
 * @returns {Array} The list with English participle objects.
 */
module.exports = function( sentencePart ) {
	var words = getWords( sentencePart.getSentencePartText() );

	var foundParticiples = [];

	forEach( words, function( word ) {
		var type = "";
		if( regularParticiples( word ).length !== 0 ) {
			type = "regular";
		}
		if( irregularParticiples( word ).length !== 0 ) {
			type = "irregular";
		}
		if ( type !== "" ) {
			foundParticiples.push( new EnglishParticiple( word, sentencePart.getSentencePartText(),
				{ auxiliaries: sentencePart.getAuxiliaries(), type: type } ) );
		}
	} );
	return foundParticiples;
};
