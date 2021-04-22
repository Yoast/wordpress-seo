import { languageProcessing } from "yoastseo";
const { getClausesSplitOnStopWords, createRegexFromArray } = languageProcessing;

import CzechClause from "../values/Clause";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopwords from "../config/stopWords.js";

const options = {
	Clause: CzechClause,
	regexes: {
		auxiliaryRegex: createRegexFromArray( auxiliaries ),
		stopCharacterRegex: /([:,])(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		stopwordRegex: createRegexFromArray( stopwords ),
	},
};

/**
 * Gets the clauses from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up into clauses.
 *
 * @returns {Array} The array with all clauses that have an auxiliary.
 */
export default function getCzechClauses( sentence ) {
	return getClausesSplitOnStopWords( sentence, options );
}
