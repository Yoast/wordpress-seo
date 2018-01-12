var getWords = require( "../../../stringProcessing/getWords.js" );
var regexFunction = require( "./regex.js" )();
var verbsBeginningWithErVerEntBeZerHerUber = regexFunction.verbsBeginningWithErVerEntBeZerHerUber;
var verbsBeginningWithGe = regexFunction.verbsBeginningWithGe;
var verbsWithGeInMiddle = regexFunction.verbsWithGeInMiddle;
var verbsWithErVerEntBeZerHerUberInMiddle = regexFunction.verbsWithErVerEntBeZerHerUberInMiddle;
var verbsEndingWithIert = regexFunction.verbsEndingWithIert;
var irregularParticiples = require( "./irregulars.js" )();

var GermanParticiple = require( "./GermanParticiple.js" );

var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );

/**
 * Creates GermanParticiple Objects for the participles found in a sentence.
 *
 * @param {string} sentencePartText The sentence to finds participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @returns {Array} The array with GermanParticiple Objects.
 */
module.exports = function( sentencePartText, auxiliaries ) {
	var words = getWords( sentencePartText );

	var foundParticiples = [];

	forEach( words, function( word ) {
		if( verbsBeginningWithGe( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "ge at beginning" } )
			);
			return;
		}
		if ( verbsWithGeInMiddle( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "ge in the middle" } )
			);
			return;
		}
		if ( verbsBeginningWithErVerEntBeZerHerUber( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "er/ver/ent/be/zer/her at beginning" } )
			);
			return;
		}
		if ( verbsWithErVerEntBeZerHerUberInMiddle( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "er/ver/ent/be/zer/her in the middle" } )
			);
			return;
		}
		if ( verbsEndingWithIert( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "iert at the end" } )
			);
		}
		if( includes( irregularParticiples, word ) ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "irregular" } )
			);
		}
	} );
	return foundParticiples;
};
