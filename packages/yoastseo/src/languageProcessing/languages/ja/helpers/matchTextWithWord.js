import { normalize as normalizeQuotes } from "../../../helpers/sanitize/quotes";
import { unifyAllSpaces as unifyWhitespace } from "../../../helpers/sanitize/unifyWhitespace";
import getContentWords from "./getContentWords";
import stripSomeTags from "../../../helpers/sanitize/stripNonTextTags";

/**
 * Checks for word matches in a text and returns an object containing the matched word(s), the number of the matched word(s)
 * and the position of the matched word(s) in the text.
 *
 * @param {string}  text            The text to find the word to match.
 * @param {string}  wordToMatch     The word to match.
 *
 * @returns {{count: number, position: number, matches: *[]}}  An object containing the matched word(s), the number of the matched word(s)
 * and the position of the matched word(s) in the text.
 */
export default function( text, wordToMatch ) {
	text = stripSomeTags( text );
	text = unifyWhitespace( text );
	text = normalizeQuotes( text );

	const words = getContentWords( text );
	const matchedWords = words.filter( word => wordToMatch === word );

	// Create an array of positions of matches to determine where in the text the wordToMatch occurred first.
	const positions = matchedWords.map( match => text.indexOf( match ) );

	return {
		count: matchedWords.length,
		matches: matchedWords,
		position: Math.min( ...positions ),
	};
}
