var arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );
var determineSentencePartIsPassive = require( "./determineSentencePartIsPassive.js" );

// Auxiliaries (only needed for German)
var auxiliariesGerman = require( "../../german/passiveVoice/auxiliaries.js" )().allAuxiliaries;

// Participles
var getParticiplesGerman = require( "../../german/passiveVoice/getParticiples.js" );
var getParticiples = require( "./getParticiples.js" );


/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePartText The sentence part to determine voice for.
 * @param {Array} auxiliaries A list with auxiliaries in this sentence part.
 * @param {string} language The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentencePartText, auxiliaries, language ) {
	var participles = [];
	if ( language === "de" ) {
		var passive = false;
		var auxiliaryMatches = sentencePartText.match( arrayToRegex( auxiliariesGerman ) );
		if ( auxiliaryMatches === null ) {
			return passive;
		}
		participles = getParticiplesGerman( sentencePartText, auxiliaries, language );
	} else {
		participles = getParticiples( sentencePartText, auxiliaries, language );
	}

	return determineSentencePartIsPassive( participles );
};
