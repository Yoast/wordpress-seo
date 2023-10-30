import getContentWords from "./getContentWords";
import processExactMatchRequest from "../../../helpers/match/processExactMatchRequest";
import { normalizeSingle } from "../../../helpers/sanitize/quotes";

/**
 * Checks for word matches in a text and returns an array containing the matched word(s).
 *
 * @param {string}  text               The text to find the word to match.
 * @param {string}  wordToMatch        The word to match.
 *
 * @returns {Array} An array of the matched word(s).
 */
export default function( text, wordToMatch ) {
	/*
     * Lowercase the text so that it matches the wordToMatch which is already lowercased.
     * Note that Japanese doesn't differentiate between upper and lower case, so this is only needed in case
     * the text contains non-Japanese characters.
     */
	text = text.toLowerCase();

	// Check if the exact match is requested.
	const isExactMatchRequested = processExactMatchRequest( wordToMatch );
	if ( isExactMatchRequested.exactMatchRequested ) {
		/*
		 * Normalize single quotes in case they differ between the text and the word to match.
		 * Normalizing is only needed for exact matching, because with non-exact matching single quotes are considered
		 * word boundaries.
		 * Quotes in wordToMatch are already normalized at an earlier point.
		*/
		text = normalizeSingle( text );

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
