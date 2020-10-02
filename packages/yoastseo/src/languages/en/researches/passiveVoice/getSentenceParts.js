import indicesProcessing from "../../stringProcessing/indices";
const getIndicesOfList = indicesProcessing.getIndicesByWordList;
const filterIndices = indicesProcessing.filterIndices;
const sortIndices = indicesProcessing.sortIndices;
import stripSpaces from "../../stringProcessing/stripSpaces.js";
import { normalizeSingle as normalizeSingleQuotes } from "../../stringProcessing/quotes.js";
import arrayToRegex from "../../stringProcessing/createRegexFromArray.js";

import { filter, isUndefined, includes, map } from "lodash-es";

import SentencePart from "./SentencePart";
import auxiliariesEnglishFactory from "./auxiliaries.js";
import stopwordsEnglishFactory from "./stopwords.js";
const auxiliaries = auxiliariesEnglishFactory().all;
const auxiliaryRegex = arrayToRegex( auxiliaries );
const stopwords = stopwordsEnglishFactory();
const stopCharacterRegex = /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig;
const verbEndingInIngRegex = /\w+ing(?=$|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;
const ingExclusionArray = [ "king", "cling", "ring", "being", "thing", "something", "anything" ];

/**
 * Gets active verbs (ending in ing) to determine sentence breakers in English.
 *
 * @param {string} sentence The sentence to get the active verbs from.
 * @returns {Array} The array with valid matches.
 */
const getVerbsEndingInIng = function( sentence ) {
	// Matches the sentences with words ending in ing.
	const matches = sentence.match( verbEndingInIngRegex ) || [];
	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return ! includes( ingExclusionArray, stripSpaces( match ) );
	} );
};

/**
 * Gets stop characters to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the stop characters from.
 * @returns {Array} The array with stop characters.
 */
const getStopCharacters = function( sentence ) {
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
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and stop characters;
 * in English also active verbs) to determine sentence parts.
 * Indices are filtered because there could be duplicate matches, like "even though" and "though".
 * In addition, 'having' will be matched both as a -ing verb as well as an auxiliary.
 *
 * @param {string} sentence The sentence to check for indices of sentence breakers.
 * @returns {Array} The array with valid indices to use for determining sentence parts.
 */
const getSentenceBreakers = function( sentence ) {
	sentence = sentence.toLocaleLowerCase();
	let auxiliaryIndices = getIndicesOfList( auxiliaries, sentence );
	const stopwordIndices = getIndicesOfList( stopwords, sentence );
	const stopCharacterIndices = getStopCharacters( sentence );
	let indices;

	var ingVerbs = getVerbsEndingInIng( sentence );
	var ingVerbsIndices = getIndicesOfList( ingVerbs, sentence );
	indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices, stopCharacterIndices );

	indices = filterIndices( indices );
	return sortIndices( indices );
};

/**
 * Gets the auxiliaries from a sentence.
 *
 * @param {string} sentencePart The part of the sentence to match for auxiliaries.
 * @returns {Array} All formatted matches from the sentence part.
 */
const getAuxiliaryMatches = function( sentencePart ) {
	const auxiliaryMatches = sentencePart.match( auxiliaryRegex ) || [];

	return map( auxiliaryMatches, function( auxiliaryMatch ) {
		return stripSpaces( auxiliaryMatch );
	} );
};

/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
const getSentenceParts = function( sentence ) {
	const sentenceParts = [];

	sentence = normalizeSingleQuotes( sentence );

	// First check if there is an auxiliary in the sentence.
	if ( sentence.match( auxiliaryRegex ) === null ) {
		return sentenceParts;
	}

	const indices = getSentenceBreakers( sentence );
	// Get the words after the found auxiliary.
	for ( let i = 0; i < indices.length; i++ ) {
		let endIndex = sentence.length;
		if ( ! isUndefined( indices[ i + 1 ] ) ) {
			endIndex = indices[ i + 1 ].index;
		}

		// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
		const sentencePart = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );

		const auxiliaryMatches = getAuxiliaryMatches( sentencePart );
		// If a sentence part doesn't have an auxiliary, we don't need it, so it can be filtered out.
		if ( auxiliaryMatches.length !== 0 ) {
			sentenceParts.push( new SentencePart( sentencePart, auxiliaryMatches ) );
		}
	}
	return sentenceParts;
};

/**
 * Split the sentence in sentence parts based on auxiliaries.
 *
 * @param {string} sentence The sentence to split in parts.
 * @returns {Array} A list with sentence parts.
 */
export default function( sentence) {
	return getSentenceParts( sentence );
}
