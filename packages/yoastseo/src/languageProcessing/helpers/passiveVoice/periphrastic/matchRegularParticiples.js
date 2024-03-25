import { flattenDeep } from "lodash";

/**
 * Returns words that have been determined to be a regular participle.
 *
 * @param {string} word         The word to check.
 * @param {RegExp[]} regexes    The regular participle regexes to match.
 *
 * @returns {Array} A list with the matches.
 */
export default function regularParticiples( word, regexes ) {
	// Matches word with language-specific participle regexes.
	let matches = [];

	regexes.forEach( function( regex ) {
		const match = word.match( regex );
		if ( match !== null ) {
			matches.push( match );
		}
	} );
	matches = flattenDeep( matches );
	return matches;
}
