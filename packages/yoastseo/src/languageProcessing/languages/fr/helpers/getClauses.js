import { languageProcessing } from "yoastseo";
const { createRegexFromArray, getClauses } = languageProcessing;

import Clause from "../values/Clause";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopwords from "../config/stopWords.js";
const followingAuxiliaryExceptionWords = [ "le", "la", "les", "une", "l'un", "l'une" ];
const reflexivePronouns = [ "se", "me", "te", "s'y", "m'y", "t'y", "nous nous", "vous vous" ];
const elisionAuxiliaryExceptionWords = [ "c'", "s'", "peut-" ];

const options = {
	Clause,
	stopwords,
	auxiliaries,
	regexes: {
		auxiliaryRegex: createRegexFromArray( auxiliaries ),
		stopCharacterRegex: /(,)(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		followingAuxiliaryExceptionRegex: createRegexFromArray( followingAuxiliaryExceptionWords ),
		directPrecedenceExceptionRegex: createRegexFromArray( reflexivePronouns ),
		elisionAuxiliaryExceptionRegex: createRegexFromArray( elisionAuxiliaryExceptionWords, true ),
	},
	indices: [],
};

/**
 * Gets the clauses from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in clauses.
 *
 * @returns {Array} The array with all clauses that have an auxiliary.
 */
export default function getFrenchClauses( sentence ) {
	return getClauses( sentence, options );
}
