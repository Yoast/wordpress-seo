import getContentWords from "./getContentWords";

/**
 * Checks for word matches in a text and returns an array containing the matched word(s).
 *
 * @param {string}  text            The text to find the word to match.
 * @param {string}  wordToMatch     The word to match.
 *
 * @returns {Array} An array of the matched word(s).
 */
export default function( text, wordToMatch ) {
	/*
	 * `getContentWords` is used here to retrieve the words from the text instead of `getWords` because it has an additional step
	 * to remove this ending -じゃ from the segmented words which means that using this method will improve matching possibility.
	 */
	const words = getContentWords( text );

	return words.filter( word => wordToMatch === word );
}
