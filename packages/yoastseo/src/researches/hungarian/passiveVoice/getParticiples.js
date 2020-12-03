import getWords from "../../../stringProcessing/getWords.js";
import participlesInReAndRa from "./participles.js";

import HungarianParticiple from "./HungarianParticiple.js";

import { forEach } from "lodash-es";

/**
 * Creates HungarianParticiple Objects for the participles found in a sentence.
 *
 * @param {string} sentencePartText         The sentence to finds participles in.
 * @param {Object} auxiliaries              The list of auxiliaries from the sentence part.
 * @param {string} language                 The language.
 *
 * @returns {Array}                         The array with HungarianParticiple Objects.
 */
export default function( sentencePartText, auxiliaries, language ) {
	const words = getWords( sentencePartText );

	const foundParticiples = [];

	forEach( words, function( word ) {
		if ( word.endsWith( "ve" ) ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "ve at the end", language: language } )
			);
			return;
		}
		if ( word.endsWith( "va" ) ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "va at the end", language: language } )
			);
			return;
		}
		if ( word.endsWith( "ódni" ) ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "ódni at the end", language: language } )
			);
			return;
		}
		if ( word.endsWith( "ődni" ) ) {
			foundParticiples.push(
				new HungarianParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "ődni at the end", language: language } )
			);
			return;
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
