const arrayToRegex = require( "../../../stringProcessing/createRegexFromArray.js" );
const determineSentencePartIsPassive = require( "./determineSentencePartIsPassive.js" );

// Auxiliaries and getParticiples (specific for German)
const auxiliariesGerman = require( "../../german/passiveVoice/auxiliaries.js" )().allAuxiliaries;
const getParticiplesGerman = require( "../../german/passiveVoice/getParticiples.js" );

// General getParticiples
const getParticiples = require( "./getParticiples.js" );


/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePartText The sentence part to determine voice for.
 * @param {Array} auxiliaries A list with auxiliaries in this sentence part.
 * @param {string} language The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentencePartText, auxiliaries, language ) {
	let participles = [];
	if ( language === "de" ) {
		let passive = false;
		let auxiliaryMatches = sentencePartText.match( arrayToRegex( auxiliariesGerman ) );
		if ( auxiliaryMatches === null ) {
			return passive;
		}
		participles = getParticiplesGerman( sentencePartText, auxiliaries, language );
	} else {
		participles = getParticiples( sentencePartText, auxiliaries, language );
	}

	return determineSentencePartIsPassive( participles );
};
