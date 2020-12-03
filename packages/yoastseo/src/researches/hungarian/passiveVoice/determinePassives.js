import arrayToRegex from "../../../stringProcessing/createRegexFromArray.js";
import auxiliariesHungarianFactory from "../../hungarian/passiveVoice/auxiliaries.js";
const hungarianAuxiliaries = auxiliariesHungarianFactory().allAuxiliaries;
import getParticiples from "./getParticiples.js";
import determineSentencePartIsPassive from "../../passiveVoice/periphrastic/determineSentencePartIsPassive.js";

const auxiliaryRegex = arrayToRegex( hungarianAuxiliaries );

/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePartText         The sentence part to determine voice for.
 * @param {Array} auxiliaries               A list with auxiliaries in this sentence part.
 * @param {string} language                 The language of the sentence part.
 *
 * @returns {boolean}                       Returns true if passive, otherwise returns false.
 */
export default function( sentencePartText, auxiliaries, language ) {
	const auxiliaryMatches = sentencePartText.match( auxiliaryRegex );

	if ( auxiliaryMatches === null ) {
		return false;
	}

	const participles = getParticiples( sentencePartText, auxiliaries, language );
	return determineSentencePartIsPassive( participles );
}
