import getWords from "../../../stringProcessing/getWords.js";
import regexFunctionFactory from "./regex.js";
const regexFunction = regexFunctionFactory();
const verbsEndingWithVe = regexFunction.verbsEndingWithVe
const verbsEndingWithVa = regexFunction.verbsEndingWithVa
import HungarianParticiple from "./HungarianParticiple.js";

import { forEach } from "lodash-es";
import { includes } from "lodash-es";

/**
 * Creates HungarianParticiple Objects for the participles found in a sentence.
 *
 * @param {string} sentencePartText         The sentence to finds participles in.
 * @param {Array} auxiliaries               The list of auxiliaries from the sentence part.
 * @param {string} language                 The language.
 *
 * @returns {Array}                         The array with HungarianParticiple Objects.
 */
export default function( sentencePartText, auxiliaries, language ) {
	const words = getWords( sentencePartText );

	const foundParticiples = [];

	forEach( words, function( word ) {
		if ( verbsEndingWithVe( word ).length !== 0 ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "ve at the end", language: language } )
			);
			return;
		}
		if ( verbsEndingWithVa( word ).length !== 0 ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "va at the end", language: language } )
			);
			return;
		}
	} );
	return foundParticiples;
}
