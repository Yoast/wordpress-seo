import { languageProcessing } from "yoastseo";
const { getClausesSplitOnStopWords, createRegexFromArray } = languageProcessing;

import Clause from "../values/Clause";
import auxiliaries from "../config/internal/auxiliaries.js";
import stopwords from "../config/stopWords.js";

const options = {
	Clause,
	regexes: {
		auxiliaryRegex: createRegexFromArray( auxiliaries ),
		stopwordRegex: createRegexFromArray( stopwords ),
	},
};

/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 *
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
export default function getClauses( sentence ) {
	return getClausesSplitOnStopWords( sentence, options );
}
