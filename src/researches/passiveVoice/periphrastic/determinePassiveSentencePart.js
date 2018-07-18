const determineSentencePartIsPassive = require( "./determineSentencePartIsPassive.js" );
const getParticiples = require( "./getParticiples.js" );

// Imports specific for German.
const auxiliariesGerman = require( "../../german/passiveVoice/auxiliaries.js" )().allAuxiliaries;
const getParticiplesGerman = require( "../../german/passiveVoice/getParticiples.js" );

// Imports specific for Dutch.
const auxiliariesDutch = require( "../../dutch/passiveVoice/auxiliaries.js" )();

// The language-specific auxiliaries.
const languageVariables = {
	de: {
		auxiliaries: auxiliariesGerman,
	},
	nl: {
		auxiliaries: auxiliariesDutch,
	},
};

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string}  sentencePartText        The sentence part to determine voice for.
 * @param {Array}   sentencePartAuxiliaries A list with auxiliaries in this sentence part.
 * @param {string}  language                The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function( sentencePartText, sentencePartAuxiliaries, language ) {
	let participles = [];
	// For German and Dutch, this path is taken in order to ensure that sentence parts without auxiliaries are not set to passive.
	if ( language === "de" || language === "nl" ) {
		// Return false if there are no auxiliaries in the sentence part.
		if ( ! sentencePartAuxiliaries.some( auxiliary => languageVariables[ language ].auxiliaries.includes( auxiliary ) ) ) {
			return false;
		}
		// For German, we use a separate function to get participles.
		if ( language === "de" ) {
			participles = getParticiplesGerman( sentencePartText, sentencePartAuxiliaries, language );
		}
		// For Dutch, we use the same function as for other languages.
		if ( language === "nl" ) {
			participles = getParticiples( sentencePartText, sentencePartAuxiliaries, language );
		}
	} else {
		participles = getParticiples( sentencePartText, sentencePartAuxiliaries, language );
	}

	return determineSentencePartIsPassive( participles );
};
