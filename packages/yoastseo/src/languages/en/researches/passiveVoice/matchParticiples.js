import { find } from "lodash-es";
import { memoize } from "lodash-es";
import { flattenDeep } from "lodash-es";

import irregularsEnglishFactory from "./irregulars";
const irregularsEnglish = irregularsEnglishFactory();

// The language-specific participle regexes.
const regularParticiplesRegex = /\w+ed($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig;

/**
 * Returns words that have been determined to be a regular participle.
 *
 * @param {string} word The word to check.
 * @param {string} language The language in which to match.
 *
 * @returns {Array} A list with the matches.
 */
const regularParticiples = function( word, language ) {
	// Matches word with language-specific participle regexes.
	let matches = [];

	const match = word.match( regularParticiplesRegex );
	if ( match !== null ) {
		matches.push( match );
	}

	matches = flattenDeep( matches );

	return matches;
};

/**
 * Returns the matches for a word in the list of irregulars.
 *
 * @param {string} word The word to match in the list.
 *
 * @returns {Array} A list with the matches.
 */
const irregularParticiples = function( word ) {
	let matches = [];

	find( irregularsEnglish, function( irregularParticiple ) {
		if ( irregularParticiple === word ) {
			matches.push( irregularParticiple );
		}
	} );

	return matches;
};

/**
 * Returns methods to return participles.
 *
 * @returns {Object} Methods to return participles.
 */
export default function() {
	return {
		regularParticiples: memoize( regularParticiples ),
		irregularParticiples: memoize( irregularParticiples ),
	};
}
