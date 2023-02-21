import { all as functionWords } from "../config/functionWords";

/**
 * Checks if a word is a function word.
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} Whether or not a word is a function word.
 */
export default function checkIfWordIsFunction( word ) {
	// All words are converted to lower case before processing to avoid excluding function words that start with a capital letter.
	word = word.toLowerCase();

	return functionWords.includes( word );
}
