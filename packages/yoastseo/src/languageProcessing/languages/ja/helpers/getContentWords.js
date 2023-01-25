import getWords from "./getWords";
import functionWords from "../config/functionWords";

/**
 * Filters out function words and removes じゃ ending if a words ends in it.
 *
 * @param {string} text The input text.
 *
 * @returns {Array} The array words with function words filtered out and じゃ removed.
 */
export default function( text ) {
	let words = getWords( text );
	// Filter function words and morphemes.
	words = words.filter( word => ! functionWords.includes( word ) );

	// Check if the segment ends in -じゃ, and remove the ending if it does.
	const ending = "じゃ";
	words = words.map( word => word.endsWith( ending ) ? word.slice( 0, -ending.length ) : word );

	return words;
}
