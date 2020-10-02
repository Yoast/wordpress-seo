import { forEach } from "lodash-es";

import getWords from "../../stringProcessing/getWords.js";
import matchParticiplesFactory from "./matchParticiples";
const matchParticiples = matchParticiplesFactory();
const regularParticipleRegex = matchParticiples.regularParticiples;
const irregularParticipleRegex = matchParticiples.irregularParticiples;

import Participle from "./Participle.js";

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @param {string} language The language to find the participles for.
 * @returns {Array} The list with participle objects.
 */
export default function( sentencePartText, auxiliaries, language ) {
	const words = getWords( sentencePartText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		let type = "";
		if ( regularParticipleRegex( word, language ).length !== 0 ) {
			type = "regular";
		}
		if ( irregularParticipleRegex( word, language ).length !== 0 ) {
			type = "irregular";
		}
		if ( type !== "" ) {
			foundParticiples.push( new Participle( word, sentencePartText,
				{ auxiliaries: auxiliaries, type: type, language: language } ) );
		}
	} );
	return foundParticiples;
}
