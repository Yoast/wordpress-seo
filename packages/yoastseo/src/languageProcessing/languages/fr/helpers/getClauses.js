import { languageProcessing } from "yoastseo";
const { createRegexFromArray, getClauses } = languageProcessing;

import Clause from "../values/Clause";
import auxiliaries from "../config/internal/passiveVoiceAuxiliaries.js";
import stopwords from "../config/stopWords.js";
import getWordIndices from "../../../helpers/passiveVoice/periphrastic/getIndicesWithRegex";
import { forEach } from "lodash-es";
import includesIndex from "../../../helpers/word/includesIndex";

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
	indices: [];
};

/**
 * Filters auxiliaries preceded by an elided word (e.g., s') on the elisionAuxiliaryExceptionWords list.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 *
 * @returns {Array} The filtered list of auxiliary indices.
 */
const elisionAuxiliaryExceptionFilter = function( text, auxiliaryMatches ) {
	const elisionAuxiliaryExceptionMatches = getWordIndices( text, options.regexes.elisionAuxiliaryExceptionRegex );

	forEach( auxiliaryMatches, function( auxiliaryMatch ) {
		if ( includesIndex( elisionAuxiliaryExceptionMatches, auxiliaryMatch.index, false ) ) {
			auxiliaryMatches = auxiliaryMatches.filter( function( auxiliaryObject ) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			} );
		}
	} );

	return auxiliaryMatches;
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
