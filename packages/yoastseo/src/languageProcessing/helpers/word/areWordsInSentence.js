import { filter } from "lodash";
import getWords from "./getWords.js";

/**
 * Checks if one or more words of a list occur in a sentence.
 *
 * @param {Array} words The list of words.
 * @param {string} sentence The sentence to match against.
 * @returns {Boolean} Whether the sentence contains the word.
 */
export default function areWordsInSentence( words, sentence ) {
	const matches = filter( getWords( sentence ), function( word ) {
		return words.includes( word.toLocaleLowerCase() );
	} );
	return matches.length !== 0;
}
