import getWords from "./getWords";
import { isEqual, dropWhile } from "lodash-es";


/**
 * Gets indices of all matches of a word in an array.
 *
 * @param {string} 		word	The word to find a match for.
 * @param {string[]}	array	The array to look for the word in.
 *
 * @returns {string[]} An array of the indices.
 */
const getIndicesOfMatches = function( word, array ) {
	const indices = [];
	let index = array.indexOf( word );
	while ( index !== -1 ) {
		indices.push( index );
		index = array.indexOf( word, index + 1 );
	}
	return indices;
};

/**
 * Checks whether an exact match of a multiword keyphrase is at the beginning of the page title. If the title begins with function words followed by
 * the keyphrase, it is still counted as being at the beginning.
 *
 * @param {string} 		title			The page title.
 * @param {string} 		keyphrase		The keyphrase.
 * @param {string[]}	functionWords	The list of function words.
 *
 * @returns {Object}	Object with information about the found exact match; or an empty object if no exact match is found.
 */
export default function( title, keyphrase, functionWords ) {
	const result = {};
	const keyphraseWords = getWords( keyphrase );
	let titleWords = getWords( title );

	// Proceed only if the keyphrase is a multi-word keyphrase and if every word from the keyphrase is in the title.
	if ( keyphraseWords.length > 1 && keyphraseWords.every( word => titleWords.includes( word ) ) ) {
		// Remove function words from the beginning of the title.
		titleWords = dropWhile( titleWords, ( word ) => {
			return functionWords.includes( word );
		} );

		// Check whether the exact match of the keyphrase occurs in the title and get its index.
		const firstKeyphraseWordIndices = getIndicesOfMatches( keyphraseWords[ 0 ], titleWords );
		for ( const index of firstKeyphraseWordIndices ) {
			const potentialKeyphrase = titleWords.slice( index, index + keyphraseWords.length );
			if ( isEqual( potentialKeyphrase, keyphraseWords ) ) {
				result.exactMatchFound = true;
				result.allWordsFound = true;
				result.position = index;
				return result;
			}
		}
	}
	return result;
}
