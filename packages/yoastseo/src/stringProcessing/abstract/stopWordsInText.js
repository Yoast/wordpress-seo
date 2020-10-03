import toRegex from "../helpers/createWordRegex.js";

/**
 * Checks a text to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {string} text The input text to match stopwords.
 * @param {Array} stopwords The stopwords to match.
 * @returns {Array} An array with all stopwords found in the text.
 */
export default function( text, stopwords ) {
	var i, matches = [];

	for ( i = 0; i < stopwords.length; i++ ) {
		if ( text.match( toRegex( stopwords[ i ] ) ) !== null ) {
			matches.push( stopwords[ i ] );
		}
	}

	return matches;
}
