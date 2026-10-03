import { forEach } from "lodash";
import { languageProcessing } from "yoastseo";
const { getWords } = languageProcessing;

import regexFunctionFactory from "../../config/internal/passiveVoiceRegex.js";
const regexFunction = regexFunctionFactory();
import irregularParticiples from "../../config/internal/passiveVoiceIrregulars.js";

const verbsBeginningWithErVerEntBeZerHerUber = regexFunction.verbsBeginningWithErVerEntBeZerHerUber;
const verbsBeginningWithGe = regexFunction.verbsBeginningWithGe;
const verbsWithGeInMiddle = regexFunction.verbsWithGeInMiddle;
const verbsWithErVerEntBeZerHerUberInMiddle = regexFunction.verbsWithErVerEntBeZerHerUberInMiddle;
const verbsEndingWithIert = regexFunction.verbsEndingWithIert;

/**
 * Creates German participles array for the participles found in a clause.
 *
 * @param {string} clauseText The clause to finds participles in.
 *
 * @returns {Array} The array with the German participles found.
 */
export default function( clauseText ) {
	const words = getWords( clauseText );

	const foundParticiples = [];

	forEach( words, function( word ) {
		if ( verbsBeginningWithGe( word ).length !== 0 ||
			verbsWithGeInMiddle( word ).length !== 0 ||
			verbsBeginningWithErVerEntBeZerHerUber( word ).length !== 0 ||
			verbsWithErVerEntBeZerHerUberInMiddle( word ).length !== 0 ||
			verbsEndingWithIert( word ).length !== 0 ||
			irregularParticiples.includes( word )
		) {
			foundParticiples.push( word );
		}
	} );
	return foundParticiples;
}
