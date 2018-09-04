import { filter } from "lodash-es";

import transliterate from './transliterate.js';
import getWords from './getWords.js';

/**
 * Counts the number of occurrences of a word in a text.
 *
 * @param {String} text The text to count the word in.
 * @param {String} wordToMatch The word to check in the text.
 * @param {String} locale The locale used for transliteration.
 * @returns {Number} The number of occurrences.
 */
export default function( text, wordToMatch, locale ) {
	var words = getWords( text );
	var count = filter( words, function( word ) {
		return ( wordToMatch === word || transliterate( wordToMatch, locale ) === word );
	} );
	return count.length;
};
