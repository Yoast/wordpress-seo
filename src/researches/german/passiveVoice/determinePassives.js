import arrayToRegex from "../../../stringProcessing/createRegexFromArray.js";
import auxiliariesGermanFactory from "../../german/passiveVoice/auxiliaries.js";
const germanAuxiliaries = auxiliariesGermanFactory().allAuxiliaries;
import getParticiples from "./getParticiples.js";
import determineSentencePartIsPassive from "../../passiveVoice/periphrastic/determineSentencePartIsPassive.js";

var auxiliaryRegex = arrayToRegex( germanAuxiliaries );

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePartText The sentence part to determine voice for.
 * @param {Array} auxiliaries A list with auxiliaries in this sentence part.
 * @param {string} language The language of the sentence part.

 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
export default function( sentencePartText, auxiliaries, language ) {
	var passive = false;
	var auxiliaryMatches = sentencePartText.match( auxiliaryRegex );
	if ( auxiliaryMatches === null ) {
		return passive;
	}
	var participles = getParticiples( sentencePartText, auxiliaries, language );
	return determineSentencePartIsPassive( participles );
}
