import { languageProcessing } from "yoastseo";
const { createRegexFromArray, getClauses } = languageProcessing;

import NorwegianClause from "../values/Clause";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopwords from "../config/stopWords.js";

const options = {
	Clause: NorwegianClause,
	stopwords,
	auxiliaries,
	regexes: {
		auxiliaryRegex: createRegexFromArray( auxiliaries ),
		stopwordRegex: createRegexFromArray( stopwords ),
		stopCharacterRegex: /([:,])(?=[ \n\r\t'"+\-»«‹›<>])/ig,
	},
};

/**
 * Gets the clauses from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in clauses.
 *
 * @returns {Array} The array with all clauses that have an auxiliary.
 */
export default function getNorwegianClauses( sentence ) {
	return getClauses( sentence, options );
}
