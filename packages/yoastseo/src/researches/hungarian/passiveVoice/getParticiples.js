import getWords from "../../../stringProcessing/getWords.js";
import regexFunctionFactory from "./regex.js";
import participlesInReAndRa from "./participles.js";
const regexFunction = regexFunctionFactory();
const verbsEndingWithVe = regexFunction.verbsEndingWithVe;
const verbsEndingWithVa = regexFunction.verbsEndingWithVa;
const verbsEndingWithOdni1 = regexFunction.verbsEndingWithOdni1;
const verbsEndingWithOdni2 = regexFunction.verbsEndingWithOdni2;

import HungarianParticiple from "./HungarianParticiple.js";

import { forEach } from "lodash-es";

/**
 * Creates HungarianParticiple Objects for the participles found in a sentence.
 *
 * @param {string} sentencePartText         The sentence to finds participles in.
 * @param {Object} auxiliaries               The list of auxiliaries from the sentence part.
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
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "ve at the end", language: language } )
			);
			return;
		}
		if ( verbsEndingWithVa( word ).length !== 0 ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "va at the end", language: language } )
			);
			return;
		}
		if ( verbsEndingWithOdni1( word ).length !== 0 ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "ódni at the end", language: language } )
			);
			return;
		}
		if ( verbsEndingWithOdni2( word ).length !== 0 ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "ődni at the end", language: language } )
			);
		}
		if ( participlesInReAndRa.includes( word ) ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "re/ra at the end", language: language } )
			);
		}
	} );
	return foundParticiples;
}
