import { forEach } from "lodash-es";
import { isEmpty } from "lodash-es";
import { map } from "lodash-es";

import stripSpaces from "../../../sanitize/stripSpaces.js";

/**
 * Strips spaces from the auxiliary matches.
 *
 * @param {Array} matches A list with matches of auxiliaries.
 * @returns {Array} A list with matches with spaces removed.
 */
function sanitizeMatches( matches ) {
	return map( matches, function( match ) {
		return stripSpaces( match );
	} );
}

/**
 * Splits sentences into clauses based on stopwords.
 *
 * @param {string} sentence The sentence to split.
 * @param {Array} stopwords The array with matched stopwords.
 *
 * @returns {Array} The array with clauses.
 */
function splitOnStopWords( sentence, stopwords ) {
	const clauses = [];

	// Split the sentence on each found stopword and push this part in an array.
	forEach( stopwords, function( stopword ) {
		const clause = sentence.split( stopword );
		if ( ! isEmpty( clause[ 0 ] ) ) {
			clauses.push( clause[ 0 ] );
		}
		const startIndex = sentence.indexOf( stopword );
		const endIndex = sentence.length;
		sentence = stripSpaces( sentence.substr( startIndex, endIndex ) );
	} );

	// Push the remainder of the sentence in the clauses array.
	clauses.push( sentence );
	return clauses;
}

/**
 * Creates clauses based on split sentences.

 * @param {Array}   clauses   The array with clauses.
 * @param {Object}  options    The language-specific regexes and Clause class.
 *
 * @returns {Array} The array with sentence parts.
 */
function createClauseObjects( clauses, options ) {
	const clauseObjects = [];
	forEach( clauses, function( clause ) {
		const foundAuxiliaries = sanitizeMatches( clause.match( options.regexes.auxiliaryRegex || [] ) );
		// If a clause doesn't have an auxiliary, we don't need it, so it can be filtered out.
		if ( foundAuxiliaries.length !== 0 ) {
			clauseObjects.push( new options.Clause( clause, foundAuxiliaries ) );
		}
	} );
	return clauseObjects;
}

/**
 * Splits the sentence into clauses based on stopwords.
 *
 * @param {string} sentence The text to split into clauses.
 * @param {Object} options The language-specific regexes and Clause class.
 *
 * @returns {Array} The array with clauses.
 */
function getClausesSplitOnStopWords( sentence, options ) {
	const auxiliaryRegex = options.regexes.auxiliaryRegex;

	// First check if there is an auxiliary in the sentence.
	if ( sentence.match( auxiliaryRegex ) === null ) {
		return [];
	}

	const stopwords = sentence.match( options.regexes.stopwordRegex ) || [];
	const clauses = splitOnStopWords( sentence, stopwords );
	return createClauseObjects( clauses, options );
}

export default getClausesSplitOnStopWords;
