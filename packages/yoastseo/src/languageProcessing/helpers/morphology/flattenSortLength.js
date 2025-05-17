import { flatten } from "lodash";

/**
 * Returns combined list of strings/words, sorted by length (descending).
 *
 * @param {Object} dataWords The words data that is going to be sorted.
 *
 * @returns {Array<string>} All words, sorted by length (descending).
 */
export default function flattenSortLength( dataWords ) {
	const allWords = flatten( Object.values( dataWords ) );

	return allWords.sort( ( a, b ) => b.length - a.length || a.localeCompare( b ) );
}
