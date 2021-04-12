import { languageProcessing } from "yoastseo";
const { splitSentence, createRegexFromArray } = languageProcessing;

import GermanClause from "../values/Clause";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopwords from "../config/stopWords.js";

const options = {
	Clause: GermanClause,
	regexes: {
		auxiliaryRegex: createRegexFromArray( auxiliaries.all ),
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
export default function getClauses( sentence ) {
	return splitSentence( sentence, options );
}
