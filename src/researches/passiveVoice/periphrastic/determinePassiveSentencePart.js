import determineSentencePartIsPassive from "./determineSentencePartIsPassive.js";
import getParticiples from "./getParticiples.js";

// Imports specific for German.
const auxiliariesGerman = require( "../../german/passiveVoice/auxiliaries.js" )().allAuxiliaries;
import getParticiplesGerman from "../../german/passiveVoice/getParticiples.js";

// Imports specific for Dutch.
import auxiliariesDutchFactory from "../../dutch/passiveVoice/auxiliaries.js";

const auxiliariesDutch = auxiliariesDutchFactory();

// Imports specific for Polish.
import auxiliariesPolishFactory from "../../polish/passiveVoice/auxiliaries.js";

const auxiliariesPolish = auxiliariesPolishFactory();

// The language-specific auxiliaries.
const languageVariables = {
	de: {
		auxiliaries: auxiliariesGerman,
	},
	nl: {
		auxiliaries: auxiliariesDutch,
	},
	pl: {
		auxiliaries: auxiliariesPolish,
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
export default function( sentencePartText, sentencePartAuxiliaries, language ) {
	let participles = [];
	// For German, Dutch and Polish, this path is taken in order to ensure that sentence parts without auxiliaries are not set to passive.
	if ( language === "de" || language === "nl" || language === "pl" ) {
		// Return false if there are no auxiliaries in the sentence part.
		if ( ! sentencePartAuxiliaries.some( auxiliary => languageVariables[ language ].auxiliaries.includes( auxiliary ) ) ) {
			return false;
		}
		// For German, we use a separate function to get participles.
		if ( language === "de" ) {
			participles = getParticiplesGerman( sentencePartText, sentencePartAuxiliaries, language );
		}
		// For Dutch and Polish, we use the same function as for other languages.
		if ( language === "nl" || language === "pl" ) {
			participles = getParticiples( sentencePartText, sentencePartAuxiliaries, language );
		}
	} else {
		participles = getParticiples( sentencePartText, sentencePartAuxiliaries, language );
	}

	return determineSentencePartIsPassive( participles );
}
