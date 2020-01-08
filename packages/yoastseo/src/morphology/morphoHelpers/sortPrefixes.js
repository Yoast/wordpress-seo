import { flatten } from "lodash-es";

/**
 * Returns combined list of all verb prefixes, sorted by length (descending).
 *
 * @param {Object} verbPrefixData The prefix data for German verbs.
 *
 * @returns {Array<string>} All verb prefixes, sorted by length (descending).
 */
export function allVerbPrefixesSorted( verbPrefixData ) {
	const allPrefixes = flatten( Object.values( verbPrefixData ) );

	return allPrefixes.sort( ( a, b ) => b.length - a.length || a.localeCompare( b ) );
}
