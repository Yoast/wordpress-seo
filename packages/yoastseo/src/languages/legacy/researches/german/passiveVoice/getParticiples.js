import getWords from "../../../stringProcessing/getWords.js";
import regexFunctionFactory from "./regex.js";
const regexFunction = regexFunctionFactory();
var verbsBeginningWithErVerEntBeZerHerUber = regexFunction.verbsBeginningWithErVerEntBeZerHerUber;
var verbsBeginningWithGe = regexFunction.verbsBeginningWithGe;
var verbsWithGeInMiddle = regexFunction.verbsWithGeInMiddle;
var verbsWithErVerEntBeZerHerUberInMiddle = regexFunction.verbsWithErVerEntBeZerHerUberInMiddle;
var verbsEndingWithIert = regexFunction.verbsEndingWithIert;
import irregularParticiplesFactory from "./irregulars.js";
const irregularParticiples = irregularParticiplesFactory();
import GermanParticiple from "./GermanParticiple.js";

import { forEach } from "lodash-es";
import { includes } from "lodash-es";

/**
 * Creates GermanParticiple Objects for the participles found in a sentence.
 *
 * @param {string} sentencePartText The sentence to finds participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @param {string} language The language.
 *
 * @returns {Array} The array with GermanParticiple Objects.
 */
export default function( sentencePartText, auxiliaries, language ) {
	var words = getWords( sentencePartText );

	var foundParticiples = [];

	forEach( words, function( word ) {
		if ( verbsBeginningWithGe( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "ge at beginning", language: language } )
			);
			return;
		}
		if ( verbsWithGeInMiddle( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "ge in the middle", language: language } )
			);
			return;
		}
		if ( verbsBeginningWithErVerEntBeZerHerUber( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "er/ver/ent/be/zer/her at beginning", language: language } )
			);
			return;
		}
		if ( verbsWithErVerEntBeZerHerUberInMiddle( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "er/ver/ent/be/zer/her in the middle", language: language } )
			);
			return;
		}
		if ( verbsEndingWithIert( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "iert at the end", language: language } )
			);
		}
		if ( includes( irregularParticiples, word ) ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "irregular", language: language } )
			);
		}
	} );
	return foundParticiples;
}
