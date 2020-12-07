import indicesProcessing from "../../word/indices";
const getIndicesOfList = indicesProcessing.getIndicesByWordList;
const filterIndices = indicesProcessing.filterIndices;
const sortIndices = indicesProcessing.sortIndices;
import stripSpaces from "../../sanitize/stripSpaces.js";
import { normalizeSingle as normalizeSingleQuotes } from "../../sanitize/quotes.js";
import getWordIndices from "./getIndicesWithRegex.js";
import includesIndex from "../../word/includesIndex";
import followsIndex from "../../word/followsIndex";

import { filter } from "lodash-es";
import { isUndefined } from "lodash-es";
import { includes } from "lodash-es";
import { map } from "lodash-es";
import { forEach } from "lodash-es";

/**
 * Gets active verbs (ending in ing) to determine sentence breakers in English.
 *
 * @param {string} sentence The sentence to get the active verbs from.
 * @param {RegExp} regex Regex to find the sentences with verbs ending in -ing.
 * @param {string} exclusions List of -ing ending words that shouldn't match.
 * @returns {Array} The array with valid matches.
 */
const getVerbsEndingInIng = function( sentence, regex, exclusions ) {
	// Matches the sentences with words ending in ing.
	const matches = sentence.match( regex ) || [];
	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return ! includes( exclusions, stripSpaces( match ) );
	} );
};

/**
 * Gets stop characters to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the stop characters from.
 * @param {RegExp} stopCharacterRegex Regex to match the stop characters.
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
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and stop characters;
 * in English also active verbs) to determine sentence parts.
 * Indices are filtered because there could be duplicate matches, like "even though" and "though".
 * In addition, 'having' will be matched both as a -ing verb as well as an auxiliary.
 *
 * @param {string} sentence The sentence to check for indices of sentence breakers.
 * @param {Object} options The language options for which to match the sentence breakers.
 * @returns {Array} The array with valid indices to use for determining sentence parts.
 */
const getSentenceBreakers = function( sentence, options) {
	sentence = sentence.toLocaleLowerCase();
	const { regexes } = options;
	let auxiliaryIndices = getIndicesOfList( options.auxiliaries, sentence );
	const stopwordIndices = getIndicesOfList( options.stopwords, sentence );
	const stopCharacterIndices = getStopCharacters( sentence, regexes.stopCharacterRegex );

	let indices;

	if ( typeof regexes.directPrecedenceExceptionRegex !== "undefined" ) {
		// Filters auxiliaries matched in the sentence based on a precedence exception filter.
		auxiliaryIndices = auxiliaryPrecedenceExceptionFilter( sentence, auxiliaryIndices, regexes.directPrecedenceExceptionRegex );
	}

	if ( typeof regexes.elisionAuxiliaryExceptionRegex !== "undefined" ) {
		// Filters auxiliaries matched in the sentence based on a elision exception filter.
		auxiliaryIndices = elisionAuxiliaryExceptionFilter( sentence, auxiliaryIndices, regexes.elisionAuxiliaryExceptionRegex);
	}

	indices = [].concat( auxiliaryIndices, stopwordIndices, stopCharacterIndices );

	if ( typeof regexes.verbEndingInIngRegex !== "undefined" ) {
		var ingVerbs = getVerbsEndingInIng( sentence, regexes.verbEndingInIngRegex, options.ingExclusions );
		var ingVerbsIndices = getIndicesOfList( ingVerbs, sentence );

		indices = indices.concat( ingVerbsIndices );
	}

	indices = filterIndices( indices );
	return sortIndices( indices );
};

/**
 * Gets the auxiliaries from a sentence.
 *
 * @param {string} sentencePart The part of the sentence to match for auxiliaries.
 * @param {object} regexes The regexes needed to find the auxiliaries.
 * @returns {Array} All formatted matches from the sentence part.
 */
const getAuxiliaryMatches = function(
	sentencePart, regexes ) {
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
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @param {object} options The language options for which to get the sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
const getSentenceParts = function( sentence, options ) {
	const sentenceParts = [];
	const auxiliaryRegex = options.regexes.auxiliaryRegex;
	const SentencePart = options.SentencePart;

	sentence = normalizeSingleQuotes( sentence );

	// First check if there is an auxiliary in the sentence.
	if ( sentence.match( auxiliaryRegex ) === null ) {
		return sentenceParts;
	}

	const indices = getSentenceBreakers( sentence, options );
	// Get the words after the found auxiliary.
	for ( let i = 0; i < indices.length; i++ ) {
		let endIndex = sentence.length;
		if ( ! isUndefined( indices[ i + 1 ] ) ) {
			endIndex = indices[ i + 1 ].index;
		}

		// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
		const sentencePart = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );

		const auxiliaryMatches = getAuxiliaryMatches( sentencePart, options.regexes );
		// If a sentence part doesn't have an auxiliary, we don't need it, so it can be filtered out.
		if ( auxiliaryMatches.length !== 0 ) {
			sentenceParts.push( new SentencePart( sentencePart, auxiliaryMatches ) );
		}
	}
	console.log( sentenceParts );
	return sentenceParts;
};

/**
 * Split the sentence in sentence parts based on auxiliaries.
 *
 * @param {string} sentence The sentence to split in parts.
 * @param {Object} options The language options for which to get the sentence parts.
 * @returns {Array} A list with sentence parts.
 */
export default function( sentence, options ) {
	return getSentenceParts( sentence, options );
}
