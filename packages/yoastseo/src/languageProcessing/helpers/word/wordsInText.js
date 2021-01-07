import toRegex from "../regex/createWordRegex.js";

/**
 * Checks a text to see if it contains certain words,
 * if it does, returns an array containing all of those words found in the text.
 *
 * @param {string} text The input text to match words.
 * @param {Array} words The words to match.
 *
 * @returns {Array} An array with all the words found in the text.
 */
export default function( text, words ) {
	const matches = [];

	for ( let i = 0; i < words.length; i++ ) {
		if ( text.match( toRegex( words[ i ] ) ) !== null ) {
			matches.push( words[ i ] );
		}
	}

	return matches;
}
