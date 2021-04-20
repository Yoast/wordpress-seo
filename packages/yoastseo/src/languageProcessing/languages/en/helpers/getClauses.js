import { languageProcessing } from "yoastseo";
const { createRegexFromArray, getClauses } = languageProcessing;

import Clause from "../values/Clause";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopwords from "../config/stopWords.js";
import { includes } from "lodash-es";
import stripSpaces from "../../../helpers/sanitize/stripSpaces";
import indicesProcessing from "../../../helpers/word/indices";
const getIndicesOfList = indicesProcessing.getIndicesByWordList;


const options = {
	Clause,
	stopwords,
	auxiliaries: auxiliaries,
	ingExclusions: [ "king", "cling", "ring", "being", "thing", "something", "anything" ],
	regexes: {
		auxiliaryRegex: createRegexFromArray( auxiliaries ),
		stopCharacterRegex: /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		verbEndingInIngRegex: /\w+ing(?=$|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
	},
	indices: [],
};

/**
 * Gets active verbs (ending in ing) to determine sentence breakers in English.
 *
 * @param {string} sentence The sentence to get the active verbs from.
 *
 * @returns {Array} The array with valid matches.
 */
const getVerbsEndingInIngIndices = function( sentence ) {
	// Matches the sentences with words ending in ing.
	let matches = sentence.match( options.verbEndingInIngRegex ) || [];
	// Filters out words ending in -ing that aren't verbs.
	matches = matches.filter( match => ! includes( options.ingExclusions, stripSpaces( match ) ) );
	return getIndicesOfList( matches, sentence );
};

/**
 * Gets the clauses from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in clauses.
 *
 * @returns {Array} The array with all clauses that have an auxiliary.
 */
export default function getEnglishClauses( sentence ) {
	options.indices = getVerbsEndingInIngIndices( sentence );
	return getClauses( sentence, options );
}
