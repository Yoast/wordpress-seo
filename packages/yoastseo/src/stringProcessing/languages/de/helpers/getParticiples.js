import getWords from "../../../helpers/getWords.js";
import regexFunctionFactory from "../config/passiveVoice/regex.js";
const regexFunction = regexFunctionFactory();
var verbsBeginningWithErVerEntBeZerHerUber = regexFunction.verbsBeginningWithErVerEntBeZerHerUber;
var verbsBeginningWithGe = regexFunction.verbsBeginningWithGe;
var verbsWithGeInMiddle = regexFunction.verbsWithGeInMiddle;
var verbsWithErVerEntBeZerHerUberInMiddle = regexFunction.verbsWithErVerEntBeZerHerUberInMiddle;
var verbsEndingWithIert = regexFunction.verbsEndingWithIert;
import irregularParticiplesFactory from "../config/passiveVoice/irregulars.js";
const irregularParticiples = irregularParticiplesFactory();
import GermanParticiple from "../config/passiveVoice/GermanParticiple.js";

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
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "ge at beginning", language: "de" } )
			);
			return;
		}
		if ( verbsWithGeInMiddle( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "ge in the middle", language: "de" } )
			);
			return;
		}
		if ( verbsBeginningWithErVerEntBeZerHerUber( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "er/ver/ent/be/zer/her at beginning", language: "de" } )
			);
			return;
		}
		if ( verbsWithErVerEntBeZerHerUberInMiddle( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText,
					{ auxiliaries: auxiliaries, type: "er/ver/ent/be/zer/her in the middle", language: "de" } )
			);
			return;
		}
		if ( verbsEndingWithIert( word ).length !== 0 ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "iert at the end", language: "de" } )
			);
		}
		if ( includes( irregularParticiples, word ) ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "irregular", language: "de" } )
			);
		}
	} );
	return foundParticiples;
}
