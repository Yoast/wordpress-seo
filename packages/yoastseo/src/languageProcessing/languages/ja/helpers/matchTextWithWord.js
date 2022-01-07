import getContentWords from "./getContentWords";
import processExactMatchRequest from "../../../helpers/match/processExactMatchRequest";

/**
 * Checks for word matches in a text and returns an array containing the matched word(s).
 *
 * @param {string}  text               The text to find the word to match.
 * @param {string}  wordToMatch        The word to match.
 * @param {string}  originalKephrase   The unprocessed keyphrase returned directly from the paper (`paper.getKeyword()`).
 * Passing this as an argument is crucial so we can know that the original keyphrase is enclosed in double quotes or not.
 *
 * @returns {Array} An array of the matched word(s).
 */
export default function( text, wordToMatch ) {
	// Check if the exact match is requested.
	const isExactMatchRequested = processExactMatchRequest( wordToMatch );
	if ( isExactMatchRequested.exactMatchRequested ) {
		const keyphrase = isExactMatchRequested.keyphrase;
		const matches = [];

		// Return the index of the match. It returns -1 if there is no match.
		let index = text.indexOf( keyphrase );
		while ( index !== -1 ) {
			// Push the match to the array.
			matches.push( keyphrase );
			// Look for the next match after the previous one and adjust the index.
			index = text.indexOf( keyphrase, index + keyphrase.length );
		}
		return matches;
	}

	/*
	 * `getContentWords` is used here to retrieve the words from the text instead of `getWords` because it has an additional step
	 * to remove this ending -じゃ from the segmented words which means that using this method will improve matching possibility.
	 */
	const words = getContentWords( text );

	return words.filter( word => wordToMatch === word );
}
