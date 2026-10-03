import { getIndicesByWordList as getIndicesOfList, filterIndices, sortIndices } from "../../word/indices";
import stripSpaces from "../../sanitize/stripSpaces.js";
import { normalizeSingle as normalizeSingleQuotes } from "../../sanitize/quotes.js";
import getWordIndices from "./getIndicesWithRegex.js";
import includesIndex from "../../word/includesIndex";
import followsIndex from "../../word/followsIndex";

import { forEach, isUndefined, map } from "lodash";

/**
 * Gets stop characters to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the stop characters from.
 * @param {RegExp} stopCharacterRegex Regex to match the stop characters.
 *
 * @returns {Array} The array with stop characters.
 */
const getStopCharacters = function( sentence, stopCharacterRegex ) {
	let match;
	const matches = [];

	stopCharacterRegex.lastIndex = 0;

	while ( ( match = stopCharacterRegex.exec( sentence ) ) !== null ) {
		matches.push(
			{
				index: match.index,
				match: match[ 0 ],
			}
		);
	}
	return matches;
};

/**
 * Filters auxiliaries preceded by a reflexive pronoun.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @param {RegExp} directPrecedenceExceptionRegex The regex needed to find the right auxiliaries.
 *
 * @returns {Array} The filtered list of auxiliary indices.
 */
const auxiliaryPrecedenceExceptionFilter = function( text, auxiliaryMatches, directPrecedenceExceptionRegex ) {
	const directPrecedenceExceptionMatches = getWordIndices( text, directPrecedenceExceptionRegex );

	forEach( auxiliaryMatches, function( auxiliaryMatch ) {
		if ( includesIndex( directPrecedenceExceptionMatches, auxiliaryMatch.index ) ) {
			auxiliaryMatches = auxiliaryMatches.filter( function( auxiliaryObject ) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			} );
		}
	} );

	return auxiliaryMatches;
};

/**
 * Filters auxiliaries followed by a word on the followingAuxiliaryExceptionWords list.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @param {RegExp} followingAuxiliaryExceptionRegex The regex needed to find the right auxiliaries.
 *
 * @returns {Array} The filtered list of auxiliary indices.
 */
const followingAuxiliaryExceptionFilter = function( text, auxiliaryMatches, followingAuxiliaryExceptionRegex ) {
	const followingAuxiliaryExceptionMatches = getWordIndices( text, followingAuxiliaryExceptionRegex );

	forEach( auxiliaryMatches, function( auxiliaryMatch ) {
		if ( followsIndex( followingAuxiliaryExceptionMatches, auxiliaryMatch ) ) {
			auxiliaryMatches = auxiliaryMatches.filter( function( auxiliaryObject ) {
				return auxiliaryObject.index !== auxiliaryMatch.index;
			} );
		}
	} );

	return auxiliaryMatches;
};

/**
 * Filters auxiliaries preceded by an elided word (e.g., s') on the elisionAuxiliaryExceptionWords list.
 *
 * @param {string} text The text part in which to check.
 * @param {Array} auxiliaryMatches The auxiliary matches for which to check.
 * @param {RegExp} elisionAuxiliaryExceptionRegex Regex to match the elisionAuxiliary exception.
 *
 * @returns {Array} The filtered list of auxiliary indices.
 */
const elisionAuxiliaryExceptionFilter = function( text, auxiliaryMatches, elisionAuxiliaryExceptionRegex ) {
	const elisionAuxiliaryExceptionMatches = getWordIndices( text, elisionAuxiliaryExceptionRegex );

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
 * Gets the indices of sentence breakers (auxiliaries, stopwords and stop characters;
 * in English also active verbs) to determine clauses.
 * Indices are filtered because there could be duplicate matches, like "even though" and "though".
 * In addition, 'having' will be matched both as a -ing verb as well as an auxiliary.
 *
 * @param {string} sentence The sentence to check for indices of sentence breakers.
 * @param {Object} options The language options for which to match the sentence breakers.
 *
 * @returns {Array} The array with valid indices to use for determining clauses.
 */
const getSentenceBreakers = function( sentence, options ) {
	sentence = sentence.toLocaleLowerCase();
	const { regexes } = options;
	let auxiliaryIndices = getIndicesOfList( options.auxiliaries, sentence );
	const stopCharacterIndices = getStopCharacters( sentence, regexes.stopCharacterRegex );
	let stopwordIndices = getIndicesOfList( options.stopwords, sentence );

	// Check in options if there are other stopword indices created based on language-specific rules.
	if ( options.otherStopWordIndices && options.otherStopWordIndices.length > 0 ) {
		stopwordIndices = stopwordIndices.concat( options.otherStopWordIndices );
	}

	if ( typeof regexes.directPrecedenceExceptionRegex !== "undefined" ) {
		// Filters auxiliaries matched in the sentence based on a precedence exception filter.
		auxiliaryIndices = auxiliaryPrecedenceExceptionFilter( sentence, auxiliaryIndices, regexes.directPrecedenceExceptionRegex );
	}

	if ( typeof regexes.elisionAuxiliaryExceptionRegex !== "undefined" ) {
		// Filters auxiliaries matched in the sentence based on a elision exception filter.
		auxiliaryIndices = elisionAuxiliaryExceptionFilter( sentence, auxiliaryIndices, regexes.elisionAuxiliaryExceptionRegex );
	}

	let totalIndices = auxiliaryIndices.concat( stopwordIndices, stopCharacterIndices );

	totalIndices = filterIndices( totalIndices );

	return sortIndices( totalIndices );
};

/**
 * Gets the auxiliaries from a sentence.
 *
 * @param {string} sentencePart The part of the sentence to match for auxiliaries.
 * @param {object} regexes The regexes needed to find the auxiliaries.
 *
 * @returns {Array} All formatted matches from the sentence part.
 */
const getAuxiliaryMatches = function( sentencePart, regexes ) {
	const { auxiliaryRegex, directPrecedenceExceptionRegex, followingAuxiliaryExceptionRegex } = regexes;
	let auxiliaryMatches = sentencePart.match( auxiliaryRegex ) || [];

	if ( typeof directPrecedenceExceptionRegex !== "undefined" || typeof followingAuxiliaryExceptionRegex !== "undefined" ) {
		// An array with the matched auxiliaries and their indices.
		let auxiliaryMatchIndices = getIndicesOfList( auxiliaryMatches, sentencePart );

		if ( typeof directPrecedenceExceptionRegex !== "undefined" ) {
			// Filters auxiliaries matched in the sentence part based on a precedence exception filter.
			auxiliaryMatchIndices = auxiliaryPrecedenceExceptionFilter( sentencePart, auxiliaryMatchIndices, directPrecedenceExceptionRegex );
		}
		// Filters auxiliaries matched in the sentence part based on a exception filter for words following the auxiliary.
		auxiliaryMatchIndices = followingAuxiliaryExceptionFilter( sentencePart, auxiliaryMatchIndices, followingAuxiliaryExceptionRegex );

		// An array with the matched auxiliary verbs (without indices).
		auxiliaryMatches = [];

		forEach( auxiliaryMatchIndices, function( auxiliaryMatchIndex ) {
			auxiliaryMatches.push( auxiliaryMatchIndex.match );
		} );
	}

	return map( auxiliaryMatches, function( auxiliaryMatch ) {
		return stripSpaces( auxiliaryMatch );
	} );
};

/**
 * Gets the clauses from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up into clauses.
 * @param {object} options The language options for which to get the clauses.
 *
 * @returns {Array} The array with all clauses that have an auxiliary.
 */
const getClauses = function( sentence, options ) {
	const clauses = [];
	const auxiliaryRegex = options.regexes.auxiliaryRegex;

	sentence = normalizeSingleQuotes( sentence );

	// First check if there is an auxiliary in the sentence.
	if ( sentence.match( auxiliaryRegex ) === null ) {
		return clauses;
	}

	const indices = getSentenceBreakers( sentence, options );
	// Get the words after the found auxiliary.
	for ( let i = 0; i < indices.length; i++ ) {
		let endIndex = sentence.length;
		if ( ! isUndefined( indices[ i + 1 ] ) ) {
			endIndex = indices[ i + 1 ].index;
		}

		// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
		const clause = stripSpaces( sentence.substring( indices[ i ].index, endIndex ) );

		const auxiliaryMatches = getAuxiliaryMatches( clause, options.regexes );
		// If a clause doesn't have an auxiliary, we don't need it, so it can be filtered out.
		if ( auxiliaryMatches.length !== 0 ) {
			const foundClause = new options.Clause( clause, auxiliaryMatches );
			clauses.push( foundClause );
		}
	}

	return clauses;
};

/**
 * Split the sentence into clauses based on auxiliaries.
 *
 * @param {string} sentence The sentence to split in parts.
 * @param {Object} options The language options for which to get the clauses.
 *
 * @returns {Array} A list with clauses.
 */
export default function( sentence, options ) {
	return getClauses( sentence, options );
}
