import { languageProcessing } from "yoastseo";
const { createRegexFromArray, getClauses } = languageProcessing;

import Clause from "../values/Clause";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopwords from "../config/stopWords.js";

const followingAuxiliaryExceptionWords = [ "il", "i", "la", "le", "lo", "gli", "uno", "una" ];
const reflexivePronouns = [ "mi", "ti", "si", "ci", "vi" ];

const options = {
	Clause,
	stopwords: stopwords,
	auxiliaries: auxiliaries,
	regexes: {
		auxiliaryRegex: createRegexFromArray( auxiliaries ),
		stopCharacterRegex: /([:,])(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		followingAuxiliaryExceptionRegex: createRegexFromArray( followingAuxiliaryExceptionWords ),
		directPrecedenceExceptionRegex: createRegexFromArray( reflexivePronouns ),
	},
};

/**
 * Gets the clauses from a sentence by determining sentence breakers.
 *
 * @param {string} sentence     The sentence to split up in sentence parts.
 *
 * @returns {Array} The array with all the clauses that have an auxiliary.
 */
export default function getItalianClauses( sentence ) {
	return getClauses( sentence, options );
}
