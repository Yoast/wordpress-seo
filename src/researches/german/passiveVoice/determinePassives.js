var arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );
var auxiliaries = require( "./auxiliaries.js" )().allAuxiliaries;
var getParticiples = require( "./getParticiples.js" );

var determineSentencePartIsPassive =  require( "../../passiveVoice/periphrastic/determineSentencePartIsPassive.js" );

var auxiliaryRegex = arrayToRegex( auxiliaries );

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePartText The sentence part to determine voice for.
 * @param {Array} auxiliaries A list with auxiliaries in this sentence part.
 * @param {string} language The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentencePartText, auxiliaries, language ) {
	var passive = false;
	var auxiliaryMatches = sentencePartText.match( auxiliaryRegex );
	if ( auxiliaryMatches === null ) {
		return passive;
	}
	var participles = getParticiples( sentencePartText, auxiliaries, language );
	return determineSentencePartIsPassive( participles );
};
