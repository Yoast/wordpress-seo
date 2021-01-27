import getWords from "../../../../helpers/word/getWords.js";
import regexFunctionFactory from "../../config/internal/passiveVoiceRegex.js";
const regexFunction = regexFunctionFactory();
import irregularParticiples from "../../config/internal/passiveVoiceIrregulars.js";
import GermanParticiple from "../../values/GermanParticiple.js";
import { forEach } from "lodash-es";

const verbsBeginningWithErVerEntBeZerHerUber = regexFunction.verbsBeginningWithErVerEntBeZerHerUber;
const verbsBeginningWithGe = regexFunction.verbsBeginningWithGe;
const verbsWithGeInMiddle = regexFunction.verbsWithGeInMiddle;
const verbsWithErVerEntBeZerHerUberInMiddle = regexFunction.verbsWithErVerEntBeZerHerUberInMiddle;
const verbsEndingWithIert = regexFunction.verbsEndingWithIert;

/**
 * Creates GermanParticiple Objects for the participles found in a sentence.
 *
 * @param {string} sentencePartText The sentence to finds participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 *
 * @returns {Array} The array with GermanParticiple Objects.
 */
export default function( sentencePartText, auxiliaries ) {
	const words = getWords( sentencePartText );

	const foundParticiples = [];

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
		if ( irregularParticiples.includes( word ) ) {
			foundParticiples.push(
				new GermanParticiple( word, sentencePartText, { auxiliaries: auxiliaries, type: "irregular", language: "de" } )
			);
		}
	} );
	return foundParticiples;
}
