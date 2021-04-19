import { flatten } from "lodash-es";

/**
 * Returns combined list of all German verb prefixes, sorted by length (descending).
 *
 * @param {Object} verbPrefixDataGerman The prefix data for German verbs.
 *
 * @returns {Array<string>} All German verb prefixes, sorted by length (descending).
 */
export function allGermanVerbPrefixesSorted( verbPrefixDataGerman ) {
	const allPrefixes = flatten( Object.values( verbPrefixDataGerman ) );

	return allPrefixes.sort( ( a, b ) => b.length - a.length || a.localeCompare( b ) );
}
