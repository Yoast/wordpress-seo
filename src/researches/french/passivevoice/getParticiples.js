var getWords = require( "../../../stringProcessing/getWords.js" );

var regexFunction = require( "../../../researches/french/passivevoice/matchParticiples" )();
var regularParticiples = regexFunction.regularParticiples;
var irregularParticiples = regexFunction.irregularParticiples;

var FrenchParticiple = require( "../FrenchParticiple.js" );

var forEach = require( "lodash/forEach" );

/**
 * Creates French participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {array} auxiliaries The list of auxiliaries from the sentence part.
 * @returns {Array} The list with French participle objects.
 */
module.exports = function( sentencePartText, auxiliaries ) {
	var words = getWords( sentencePartText );
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
			foundParticiples.push( new FrenchParticiple( word, sentencePartText,
				{ auxiliaries: auxiliaries, type: type } ) );
		}
	} );
	return foundParticiples;
};
