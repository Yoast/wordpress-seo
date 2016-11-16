var arrayToRegex = require( "../../stringProcessing/createRegexFromArray.js" );
var auxiliaries = require( "./passivevoice-german/auxiliaries.js" )();
var getParticiples = require( "./passivevoice-german/getParticiples.js" );

var forEach = require( "lodash/forEach" );

var auxiliaryRegex = arrayToRegex( auxiliaries );

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePartText The sentence part to determine voice for.
 * @param {Array} auxiliaries A list with auxiliaries in this sentence part.
 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentencePartText, auxiliaries ) {
	var passive = false;
	var auxiliaryMatches = sentencePartText.match( auxiliaryRegex );
	if ( auxiliaryMatches === null ) {
		return passive;
	}
	var participles = getParticiples( sentencePartText, auxiliaries );
	forEach( participles, function( participle ) {
		if ( participle.determinesSentencePartIsPassive() ) {
			passive = true;
		}
	} );
	return passive;
};
