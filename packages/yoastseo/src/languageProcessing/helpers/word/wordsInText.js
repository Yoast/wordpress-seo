import toRegex from "../regex/createWordRegex.js";

/**
 * Checks a text to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {string} text The input text to match stopwords.
 * @param {Array} words The words to match.
 * @returns {Array} An array with all stopwords found in the text.
 */
export default function( text, words ) {
	var i, matches = [];

	for ( i = 0; i < words.length; i++ ) {
		if ( text.match( toRegex( words[ i ] ) ) !== null ) {
			matches.push( words[ i ] );
		}
	}

	return matches;
}
