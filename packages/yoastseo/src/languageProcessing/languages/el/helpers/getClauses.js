import { languageProcessing } from "yoastseo";
const { getClausesSplitOnStopWords, createRegexFromArray } = languageProcessing;

import GreekClause from "../values/Clause";
import { allAuxiliaries } from "../config/internal/auxiliaries.js";
const stopWords = [ "να" ];

const options = {
	Clause: GreekClause,
	regexes: {
		auxiliaryRegex: createRegexFromArray( allAuxiliaries ),
		stopwordRegex: createRegexFromArray( stopWords ),
	},
};

/**
 * Gets the clauses from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in clauses.
 *
 * @returns {Array} The array with all clauses that have an auxiliary.
 */
export default function getGreekClauses( sentence ) {
	return getClausesSplitOnStopWords( sentence, options );
}
